/*
  TODO: take care of
  if locale !== 'en'
      script(src=`/components/moment/locale/${locale}.js`)
      script(src=`/components/summernote/dist/lang/summernote-${fullLocale}.min.js`)
  script(src=`/components/angular-i18n/angular-locale_${locale}.js`)

  // /js/constants.js

  // jquery.focus.js
  // angular-localforage

  // materialAdmin
  */

const SOURCEDIR = `${__dirname}/src`;
const path = require('path');
const copyFileSync = require('fs').copyFileSync;
const accessSync = require('fs').accessSync;
const ACCESS_READ = require('fs').constants.R_OK;
const glob = require('glob-all');
const mkdirp = require('mkdirp');

const { coreModules, dependenceModules } = require('./constants');
const CONSTANTS = require('./constants');
const CommonLibsBuilder = require('./common-libs-builder');

const {
  createAngularBindingFile,
  extractAssetsFromIndexPug,
  copyReplacements,
  copyComponents,
  extractAssetsFromCoreInjections,
  extractAssetsFromCoreModules,
  cleanSourceDir,
  copyCoreModules,
  createCoreModulesRequireFiles,
  copyCoreAssetViews,
  resolveTemplateFromNgTemplateUrl
} = require('./file-utils');

const cssUtils = require('./css-utils');
const { writeFileSync, readFileSync } = require('fs');

const indexHTML = path.resolve(__dirname, 'node_modules/linagora-rse/frontend/views/esn/index.pug');
const ENTRYPOINT = path.resolve(SOURCEDIR, 'index.js');
const commonLibsBuilder = new CommonLibsBuilder(SOURCEDIR);

module.exports = run;



/**
 * This functino takes all the scripts that have been linked using <script></script> tags,
 * and return 2 lists: the files that should be copied and included in the webpack index.js file,
 * and the files that should not be copied, but only linked in the index.js file.
 *
 * -> components:
 *    if component is managed by NPM, no copy necessary
 *    if component is orphaned (not in NPM), we copy it
 *
 *
 * @param {[String]} files  all the files that are linked through script tag in ESN index.pug
 */
function normalizeVendorAssets(files) {
  const result = {
    toCopy: [],
    linkOnly: []
  };
  files.forEach(f => {
    if (f.startsWith('/components/')) {
      const bowerModuleName = f.split('/')[2];
      const inNodeModules = findInExBower(bowerModuleName);
      if (inNodeModules) {
        return;
      }

      // now for .min.js we try to get the .js
      if (f.endsWith('.min.js')) {
        const notMinified = f.replace('.min.js', '.js');
        const notMinifiedFullPath = path.resolve(
          __dirname, `node_modules/linagora-rse/frontend${notMinified}`
        );
        try {
          accessSync(notMinifiedFullPath, ACCESS_READ);
          console.log(`- using ${notMinifiedFullPath}`);
          return result.toCopy.push(`node_modules/linagora-rse/frontend${notMinified}`);
        } catch(e) {
          // nothing
        }
      }

      return result.toCopy.push(`node_modules/linagora-rse/frontend${f}`);
    }
    if (f.startsWith('js/')) {
      return result.toCopy.push(`node_modules/linagora-rse/frontend/${f}`);
    }

    return result.toCopy.push(f);
  });

  result.linkOnly = result.linkOnly.concat(getExBowerAssets());

  return [result.toCopy, result.linkOnly];
}

function findInExBower(name) {
  let result = false;
  CONSTANTS.EX_BOWER.forEach((mod) => {
    if (mod.name === name || mod.bowerName === name) {
      result = mod.name;
    }
  });
  return result;
}

function getExBowerAssets() {
  let result = [];
  CONSTANTS.EX_BOWER.forEach((mod) => {
    if (!mod.file) {
      return;
    }
    const files = Array.isArray(mod.file) ? mod.file: [mod.file];
    files.forEach(f => {
      result.push([mod.name, f].join('/'));
    });
  });
  return result;
}

function normalizeCoreAssets(files) {
  const workdir = `${__dirname}/`;

  return files.map(f => f.replace(workdir, ''));
}

function normalizeCoreModules(files) {
  const workdir = `${__dirname}/`;

  return files.map(f => f.replace(workdir, ''));
}

/**
 * Copy all necessary files from ESN tree
 *
 * @param {Array} files list of all files to copy
 */
function copySourceFiles(files) {
  const filesBase = 'node_modules/linagora-rse/';
  const allDestinationFiles = [];

  files.forEach(f => {
    const fbase = path.dirname(f);
    const fname = path.basename(f);
    if (CONSTANTS.EXCLUDE_FROM_COPY.includes(f)) {
      console.log('not copying', f);
      return;
    }
    const fdestDir = `${SOURCEDIR}/${fbase.replace(filesBase, '')}`;
    const fdestFullName = `${fdestDir}/${fname}`;
    mkdirp.sync(fdestDir);
    copyFileSync(f, fdestFullName);
    allDestinationFiles.push(fdestFullName);
  });
  return allDestinationFiles;
}


/**
 * creates a file angular-injections.js that contains the list of all modules
 * dependencies, used in angular.module('esnApp', [HERE])
 *
 * @param {Array} coreAssets core (ESN/frontend/js/modules) Angular modules
 * @param {Array} coreModules in-esn modules (ESN/modules)
 * @param {Array} dependenceModules awesome modules that this SPA depends on
 */
function createAngularInjections(coreAssets, coreModules) {
  /*const fileFullPath = path.resolve(`${SOURCEDIR}`, 'angular-injections.js');
  const modules = coreAssets.angularModulesName
    .concat(coreModules.angularModulesName)
    .concat(dependenceModules.angularModulesName);

  const fileContents = `module.exports = ${JSON.stringify(modules)};`;

  writeFileSync(fileFullPath, fileContents);
  */

}

function createAllRequireModulesAngularInjections(coreModules) {
  const fileFullPath = path.resolve(`${SOURCEDIR}`, 'require-angular-injections.js');
  console.log('creating ', fileFullPath);
  let fileContents = `const injections = require('./frontend/require-angular-injections.js')\n`;
  coreModules.forEach((mod) => {
    modFilePath = `./modules/${mod.name}/require-angular-injections.js`;
    fileContents += `require('${modFilePath}');\n\n`;
  });
  fileContents += `module.exports = injections;\n`;
  writeFileSync(fileFullPath, fileContents);
}

function createAngularCoreModulesInjections(coreModules) {
  coreModules.forEach((mod) => {
    console.log('angular-injections file for', mod.name);
    const injection = [ mod.angularModuleName ];
    const filePath = `modules/${mod.name}/require-angular-injections.js`;
    const requireRoot = '../../frontend/require-angular-injections.js';
    commonLibsBuilder.createAngularInjectionsFile(injection, { filePath, requireRoot });
  });


}

function createAngularCoreAssetsInjections(coreAssets) {
  const fileFullPath = path.resolve(`${SOURCEDIR}`, 'frontend', 'require-angular-injections.js');
  const fileContents = `module.exports = ${JSON.stringify(coreAssets.angularModulesName)};\n`;
  writeFileSync(fileFullPath, fileContents);
}

/**
 * Create a index.js file, that contains all the required js files
 *
 * This file is used by webpack as the starting point
 *
 * @param {Array} allFiles files to require
 */
function createEntryPoint(allFiles) {
  let entryPointContents = 'require("./all.less");\n';
  // let counter=1;
  allFiles.forEach((f) => {
    relativePath = f.replace(SOURCEDIR, '.');
    entryPointContents += `require('${relativePath}');\n`;

  });
  writeFileSync(ENTRYPOINT, entryPointContents);
}

function createFrontendEntreyPoint(allFiles) {
  let entryPointContents = '';
  // let counter=1;
  allFiles.forEach((f) => {
    let relativePath = f.replace(SOURCEDIR, '.');
    if (relativePath.startsWith('./frontend/')) {
      relativePath = './' + relativePath.substr(11);
    }
    entryPointContents += `require('${relativePath}');\n`;

  });
  writeFileSync(path.resolve(SOURCEDIR, 'frontend', 'index.js'), entryPointContents);
}



function fixAngularTemplateImports() {
  const allJsFiles = glob.sync([
    `${path.resolve(SOURCEDIR, 'frontend', 'js')}/**/*.js`,
    `!${path.resolve(SOURCEDIR, 'frontend', 'js')}/modules/timeline/timeline-entry-displayer.component.js`
  ]);
  const mappings = [{
    from: '/views/',
    to: path.resolve(SOURCEDIR, 'frontend', 'views')
  },
    {
      from: '/views/',
      to: path.resolve(SOURCEDIR, 'frontend', 'js')
    }
  ];
  allJsFiles.forEach((f) => {
    let fileContents = readFileSync(f, 'utf8');
    fileContents = fileContents.replace(/(templateUrl:\s+'([^']+)')/g, function(match, p1, p2) {
      const pugFile = resolveTemplateFromNgTemplateUrl(p2, mappings, path.dirname(f));
      let relativePath = path.relative(path.dirname(f), path.dirname(pugFile));
      if (relativePath.length && !relativePath.startsWith('.')) {
        relativePath = `./${relativePath}`;
      } else if (!relativePath.length) {
        relativePath = './';
      }
      const back = `template: require("${relativePath}/${path.basename(pugFile)}")`;
      return back;
    });
    writeFileSync(f, fileContents);
  });
}

function analyze() {
  const vendorAssetsRaw = extractAssetsFromIndexPug(indexHTML);
  const coreAssetsRaw = extractAssetsFromCoreInjections();
  const coreModulesRaw = extractAssetsFromCoreModules(CONSTANTS.coreModules);
  let [vendorAssets, vendorAssetsToLink] = normalizeVendorAssets(vendorAssetsRaw);
  const vendorAssetsToCopy = vendorAssets.filter(a => !a.startsWith('node_modules/linagora-rse/frontend/components/'));
  vendorAssetsToLink = vendorAssetsToLink.concat(
    vendorAssets.filter(a => a !== '/socket.io/socket.io.js').map(a => a.replace('node_modules/linagora-rse/', './'))
  );
  const coreAssets = {
    angularModulesName: coreAssetsRaw.angularModulesName,
    files: normalizeCoreAssets(coreAssetsRaw.files)
  };
  const coreModules = {
    angularModulesName: coreModulesRaw.angularModulesName,
    files: normalizeCoreModules(coreModulesRaw.files)
  };

  const allFiles = vendorAssetsToCopy.concat(coreAssets.files);

  return {
    coreAssets,
    coreModules,
    vendorAssetsToLink,
    allFiles
  };
}

function createJSFiles({ coreAssets, coreModules, allFiles, vendorAssetsToLink }) {
  cleanSourceDir(SOURCEDIR);
  createAngularBindingFile(SOURCEDIR);
  const copiedFiles = copySourceFiles(allFiles);
  copyComponents(SOURCEDIR, CONSTANTS.BOWER_ORPHANED);
  copyCoreModules(__dirname, SOURCEDIR, CONSTANTS.coreModules);


  // create src/frontend/require-angular-injections.js
  createAngularCoreAssetsInjections(coreAssets);

  // create src/modules/MOD_NAME/require-angular-injections.js
  createAngularCoreModulesInjections(CONSTANTS.coreModules);

  // create src/require-angular-injections.js
  createAllRequireModulesAngularInjections(CONSTANTS.coreModules);

  // create src/frontend/index.js
  createFrontendEntreyPoint(vendorAssetsToLink.concat(copiedFiles));

  // create src/modules/MOD_NAME/index.js
  createCoreModulesRequireFiles(SOURCEDIR, CONSTANTS.coreModules);

  copyCoreAssetViews(__dirname, SOURCEDIR);

  fixAngularTemplateImports();

  // creates src/index.js
  createEntryPoint(['./frontend/index.js']
    .concat(['./angular-common.js', './require-angular-injections.js'])
    .concat(CONSTANTS.coreModules.map(m => `./modules/${m.name}/index.js`))
    .concat(['./frontend/js/constants.js'])
  );
}

function createCssFiles() {
  cssUtils.copyEsnLess();
  cssUtils.copyCoreModulesLess();
  cssUtils.createRootLessFile();
  cssUtils.copyCoreInjectionsFiles();
  cssUtils.duplicateMeterialAdminImages();
}

function run() {
  const jsFilesInformation = analyze();

  createJSFiles(jsFilesInformation);
  createCssFiles();

  // files that should be replaced, no webpack loader able to fix their code
  copyReplacements();
}

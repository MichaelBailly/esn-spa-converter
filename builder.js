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
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const { coreModules, dependenceModules } = require('./constants');
const CONSTANTS = require('./constants');

const {
  createAngularBindingFile,
  extractAssetsFromIndexPug,
  copyReplacements,
  copyComponents,
  extractAssetsFromCoreInjections
} = require('./file-utils');

const cssUtils = require('./css-utils');
const { writeFileSync } = require('fs');

const indexHTML = path.resolve(__dirname, 'node_modules/linagora-rse/frontend/views/esn/index.pug');
const ENTRYPOINT = path.resolve(SOURCEDIR, 'index.js');

module.exports = run;

function extractAssetFromDependenceModules() {
  const result = [];
  dependenceModules.forEach((mod) => {
    const modLocalPath = `node_modules/${mod.name}/${mod.fileRoot}`;
    const tmpResult = extractAssetsFromAwesomeModule(mod, modLocalPath);
    result.push(tmpResult);
  });
  return result;
}

function extractAssetsFromCoreModules() {
  const result = {
    files: [],
    angularModulesName: []
  };
  coreModules.forEach((mod) => {
    const modLocalPath = `node_modules/linagora-rse/modules/${mod.name}/${mod.fileRoot}`;
    const tmpResult = extractAssetsFromAwesomeModule(mod, modLocalPath);
    result.files = result.files.concat(tmpResult.files);
    result.angularModulesName = result.angularModulesName.concat(tmpResult.angularModulesName);
  });

  return result;
}

function extractAssetsFromAwesomeModule(mod, modLocalPath) {
  const result = {
    files: [],
    angularModulesName: [],
    mod,
    modLocalPath
  };

  const mPath = path.resolve(__dirname, modLocalPath);

  if (mod.filesGlob) {
    const filesGlob = mod.filesGlob.map(f => `${mPath}/${f}`);
    result.files = result.files.concat(glob.sync(filesGlob));
  } else {
    result.files = result.files.concat(mod.files.map(f => `${mPath}/${f}`));
  }
  result.angularModulesName.push(mod.angularModuleName);
  return result;
}

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

function normalizeDependenceModules(m) {
  const workdir = `${__dirname}/`;

  return m.files.map(f => f.replace(workdir, ''));
}

function cleanSourceDir() {
  rimraf.sync(SOURCEDIR);
  mkdirp.sync(SOURCEDIR);
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

function getDependenceModuleSourceJsFilesImports(dependenceModulesRaw) {
  const filesImportPath = [];
  dependenceModulesRaw.forEach((m) => {
    const basePath = path.resolve(__dirname, 'node_modules') + '/';
    m.files.forEach((f) => {
      filesImportPath.push(
        f.replace(basePath, '')
      );
    });
  });
  return filesImportPath;
}

/**
 * creates a file angular-injections.js that contains the list of all modules
 * dependencies, used in angular.module('esnApp', [HERE])
 *
 * @param {Array} coreAssets core (ESN/frontend/js/modules) Angular modules
 * @param {Array} coreModules in-esn modules (ESN/modules)
 * @param {Array} dependenceModules awesome modules that this SPA depends on
 */
function createAngularInjections(coreAssets, coreModules, dependenceModules) {
  const fileFullPath = path.resolve(`${SOURCEDIR}`, 'angular-injections.js');
  const modules = coreAssets.angularModulesName
    .concat(coreModules.angularModulesName)
    .concat(dependenceModules.angularModulesName);

  const fileContents = `module.exports = ${JSON.stringify(modules)};`;

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
  let entryPointContents = 'import "./frontend/all.less";\n';
  // let counter=1;
  allFiles.forEach((f) => {
    relativePath = f.replace(SOURCEDIR, '.');
    entryPointContents += `require('${relativePath}');\n`;

  });
  writeFileSync(ENTRYPOINT, entryPointContents);
}

function analyze() {
  const vendorAssetsRaw = extractAssetsFromIndexPug(indexHTML);
  const coreAssetsRaw = extractAssetsFromCoreInjections();
  const coreModulesRaw = extractAssetsFromCoreModules();
  const dependenceModulesRaw = extractAssetFromDependenceModules();
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
  const dependenceModules = {
    angularModulesName: dependenceModulesRaw.map(m => m.angularModulesName).reduce((acc, val) => acc.concat(val), []),
    files: dependenceModulesRaw.map(m => normalizeDependenceModules(m)).reduce((acc, val) => acc.concat(val), [])
  };
  const depAwesomeModulesJsFiles = getDependenceModuleSourceJsFilesImports(dependenceModulesRaw);

  const allFiles = ['./angular-common.js', './angular-injections.js']
    .concat(vendorAssetsToCopy)
    .concat(coreAssets.files)
    .concat(coreModules.files);

  return {
    coreAssets,
    coreModules,
    dependenceModules,
    vendorAssetsToLink,
    depAwesomeModulesJsFiles,
    allFiles
  };
}

function createJSFiles({ coreAssets, coreModules, dependenceModules, allFiles, vendorAssetsToLink, depAwesomeModulesJsFiles }) {
  cleanSourceDir();
  createAngularBindingFile(SOURCEDIR);
  createAngularInjections(coreAssets, coreModules, dependenceModules);
  const copiedFiles = copySourceFiles(allFiles);
  copyComponents(SOURCEDIR, CONSTANTS.BOWER_ORPHANED);
  createEntryPoint(vendorAssetsToLink
    .concat(copiedFiles)
    .concat(['./frontend/js/constants.js'])
    .concat(depAwesomeModulesJsFiles));
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

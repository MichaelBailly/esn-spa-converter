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
const fs = require('fs').promises;
const copyFileSync = require('fs').copyFileSync;
const glob = require('glob-all');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const { coreModules, dependenceModules, MODULES_USES_NPM } = require('./constants');
const CONSTANTS = require('./constants');

const { createAngularBindingFile, extractAssetsFromIndexPug, copyReplacements, copyComponents } = require('./file-utils');

const coreFrontEndInjections = require('./node_modules/linagora-rse/backend/webserver/core-frontend-injections');
const cssUtils = require('./css-utils');

const indexHTML = path.resolve(__dirname, 'node_modules/linagora-rse/frontend/views/esn/index.pug');
const ENTRYPOINT = path.resolve(SOURCEDIR, 'index.js');

async function extractAssetsFromCoreInjections() {
  console.log('Extracting assets from ESN core injections (frontend/js)')
  const result = {
    files: [],
    angularModulesName: []
  };
  const wsw = {
    injectAngularModules(_core, files, angular, innerapps, localJsFiles) {
      result.files = result.files.concat(localJsFiles.localJsFiles);
      result.angularModulesName.push(angular);
    }
  };
  coreFrontEndInjections(wsw, ['esn']);
  return result;
}

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

async function createAngularInjections(coreAssets, coreModules, dependenceModules) {
  const fileFullPath = path.resolve(`${SOURCEDIR}`, 'angular-injections.js');
  const modules = coreAssets.angularModulesName
    .concat(coreModules.angularModulesName)
    .concat(dependenceModules.angularModulesName);

  const fileContents = `module.exports = ${JSON.stringify(modules)};`;

  return fs.writeFile(fileFullPath, fileContents);
}

async function createEntryPoint(allFiles) {
  let entryPointContents = 'import "./frontend/all.less";\n';
  // let counter=1;
  MODULES_USES_NPM.forEach((m) => {
    const mBase = m.webpackFile.replace('./node_modules/', '');
    entryPointContents += `require('${mBase}');\n`;
  });
  allFiles.forEach((f) => {
    relativePath = f.replace(SOURCEDIR, '.');
    entryPointContents += `require('${relativePath}');\n`;

  });
  return fs.writeFile(ENTRYPOINT, entryPointContents);
}

async function run() {
  const vendorAssetsRaw = await extractAssetsFromIndexPug(MODULES_USES_NPM, indexHTML);
  const coreAssetsRaw = await extractAssetsFromCoreInjections();
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

  const allFiles = ['./angular-common.js', './angular-injections.js']
    .concat(vendorAssetsToCopy)
    .concat(coreAssets.files)
    .concat(coreModules.files);

  cleanSourceDir();
  await createAngularBindingFile(SOURCEDIR);
  await createAngularInjections(coreAssets, coreModules, dependenceModules);
  const copiedFiles = copySourceFiles(allFiles);
  copyComponents(SOURCEDIR, CONSTANTS.BOWER_ORPHANED);
  const depAwesomeModulesJsFiles = getDependenceModuleSourceJsFilesImports(dependenceModulesRaw);
  await createEntryPoint(vendorAssetsToLink
    .concat(copiedFiles)
    .concat(['./frontend/js/constants.js'])
    .concat(depAwesomeModulesJsFiles));

  // CSS
  cssUtils.copyEsnLess();
  cssUtils.copyCoreModulesLess();
  cssUtils.createRootLessFile();
  cssUtils.copyCoreInjectionsFiles();
  cssUtils.duplicateMeterialAdminImages();
  await copyReplacements();
}



run();

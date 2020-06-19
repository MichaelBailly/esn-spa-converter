const CONSTANTS = require('./constants');
const fs = require('fs');
const path = require('path');
const glob = require('glob-all');
const mkdirp = require('mkdirp');
const copyDir = require('copy-dir');

const ESN_ROOT = path.resolve(__dirname, 'node_modules', 'linagora-rse');

module.exports = {
  copyEsnLess,
  copyCoreModulesLess,
  createRootLessFile,
  copyCoreInjectionsFiles,
  duplicateMeterialAdminImages
};

function copyCoreInjectionsFiles() {
  const srcFrontend = path.resolve(ESN_ROOT, 'frontend');
  const destFrontEnd = path.resolve(__dirname, 'src', 'frontend');

  CONSTANTS.coreInjectionsFiles.forEach((f) => {
    const srcFile = path.resolve(srcFrontend, f);
    const destFile = path.resolve(destFrontEnd, f);
    mkdirp.sync(path.dirname(destFile));
    fs.copyFileSync(srcFile, destFile);
  });
}

function copyEsnLess() {
  console.log('Copying ESN less files');
  const CSS_ROOT = path.resolve(ESN_ROOT, 'frontend', 'css');
  const CSS_DEST = path.resolve(__dirname, 'src', 'frontend', 'css');

  const files = glob.sync([`${CSS_ROOT}/**/*.less`]);

  files.forEach((f) => {
    const pathname = path.dirname(f);
    const destPathname = pathname.replace(CSS_ROOT, CSS_DEST);
    const destFile = f.replace(CSS_ROOT, CSS_DEST);

    mkdirp.sync(destPathname);
    fs.copyFileSync(f, destFile);
  });
}

function copyCoreModulesLess() {
  console.log('Copying ESN core modules less files');
  const destModulesRoot = path.resolve(__dirname, 'src', 'modules');

  CONSTANTS.coreModules.forEach((mod) => {
    if (!mod.cssRoot) {
      return;
    }
    console.log('copy less files of', mod.name);

    const srcModuleRoot = path.resolve(ESN_ROOT, 'modules', mod.name, mod.frontendRoot);
    const destModuleRoot = path.resolve(destModulesRoot, mod.name, mod.frontendRoot);

    const srcLessFiles = glob.sync([`${srcModuleRoot}/**/*.less`]);

    srcLessFiles.forEach((lessFile) => {
      mkdirp.sync(path.dirname(lessFile).replace(srcModuleRoot, destModuleRoot));
      fs.copyFileSync(lessFile, lessFile.replace(srcModuleRoot, destModuleRoot));
    });
  });
}

function createRootLessFile() {
  console.log('Creating root less file');
  const rootLessFile = path.resolve(__dirname, 'src', 'frontend', 'all.less');
  const relativeFileRoot = './components/';
  let contents = '';

  CONSTANTS.EX_BOWER.forEach((bm) => {
    if (!bm.css || bm.skipLinkTag) {
      return;
    }
    console.log('include CSS for component', bm.name);
    const cssList = Array.isArray(bm.css) ? bm.css : [bm.css];
    cssList.forEach((cssFile) => {
      contents += `@import "~${bm.name}/${cssFile}";\n`;
    });
  });

  const allComponents = CONSTANTS.BOWER_ORPHANED;
  allComponents.forEach((bm) => {
    if (!bm.css || bm.skipLinkTag) {
      return;
    }
    console.log('include CSS for component', bm.name);
    const cssList = Array.isArray(bm.css) ? bm.css : [bm.css];
    cssList.forEach((cssFile) => {
      contents += `@import "${relativeFileRoot}${bm.name}/${cssFile}";\n`;
    });
  });

  // main ESN less file
  contents += `@import "./css/styles.less";\n`;

  // ESN core modules
  CONSTANTS.coreModules.forEach((mod) => {
    if (!mod.cssRoot) {
      return;
    }
    console.log('include less for module', mod.name);
    const cssList = Array.isArray(mod.cssRoot) ? mod.cssRoot : [mod.cssRoot];
    cssList.forEach((cssFile) => {
      contents += `@import "../modules/${mod.name}/${cssFile}";\n`;
    });
  });

  fs.writeFileSync(rootLessFile, contents);
}

/**
 * Less management of relative URLs ( url(../img/menu.png) ) is completely broken.
 * It's unable to rewrite correctly, adding '/less': maybe taking ../ just like ./
 */
function duplicateMeterialAdminImages() {
  console.log('duplicating material admin img folder because of less bug');
  copyDir.sync(
    path.resolve(__dirname, 'src', 'frontend', 'components', 'material-admin', 'img'),
    path.resolve(__dirname, 'src', 'frontend', 'components', 'material-admin', 'less', 'img'),
  );
  copyDir.sync(
    path.resolve(__dirname, 'src', 'frontend', 'components', 'material-admin', 'img'),
    path.resolve(__dirname, 'src', 'frontend', 'components', 'bootstrap', 'less', 'img'),
  );
}

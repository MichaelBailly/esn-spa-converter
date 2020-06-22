const path = require('path');
const glob = require('glob-all');
const mkdirp = require('mkdirp');
const { writeFileSync, readFileSync } = require('fs');
const copyFileSync = require('fs').copyFileSync;

module.exports = {
  createAngularBindingFile,
  extractAssetsFromIndexPug,
  copyReplacements,
  copyComponents
}

/**
 * Creates an angular-common.js file, that exposes angular as a webpack object
 *
 * Angular is not exposing it's angular object as a module exports. This wrapper
 * does it for us. It's associated with webpack.conf.js "angular" rule in the ProvidePlugin
 *
 * @param {string} SOURCEDIR the source directory
 */
function createAngularBindingFile(SOURCEDIR) {
  console.log('Creating AngularJS binding file for webpack');
  const fileFullPath = path.resolve(`${SOURCEDIR}`, 'angular-common.js');
  const fileContents = `require('angular/angular.js');

module.exports = window.angular;
`

  writeFileSync(fileFullPath, fileContents);
}


function extractAssetsFromIndexPug(indexHTML) {
  console.log('extracting javascript assets from esn/index.pug');
  const staticAssets = [];
  const indexHTMLContents = readFileSync(indexHTML, { encoding: 'utf8' });
  indexHTMLContents.split('\n').forEach(l => {
    const line = l.trim();
    if (line.startsWith('script(src=') && !line.match(/\$\{/)) {
      const fPath = line.replace('script(src=\'', '').replace('\')', '');
      if (fPath === 'js/constants.js') {
        return;
      }
      staticAssets.push(fPath);
    }
  });

  return staticAssets;
}

function copyReplacements() {
  console.log('Copying all files replaced because they are not webpack-friendly');
  const files = glob.sync(['replacements/**'], {nodir: true});

  files.forEach(f => {
    console.log(f);
    copyFileSync(f, f.replace('replacements/', ''));
  });
}

/**
 * Copy needed frontend/components modules in the source tree
 *
 * @param {string} SOURCEDIR folder that the sources should be copied to
 * @param {Array} components list of bower frontend/components to copy
 */
function copyComponents(SOURCEDIR, components) {
  console.log('Copying all frontend/components files');
  const componentsSrcRoot = path.resolve(__dirname, 'node_modules', 'linagora-rse', 'frontend', 'components');
  const componentsDestRoot = path.resolve(SOURCEDIR, 'frontend', 'components');

  // list all files of all bower dependencies
  let allComponentFiles = [];
  components.forEach((component) => {
    const name = component.bowerName ? component.bowerName : component.name;
    compSrcRoot = path.resolve(componentsSrcRoot, name);
    const cFiles = glob.sync([`${compSrcRoot}/**`], { nodir: true });
    allComponentFiles = allComponentFiles.concat(cFiles);
  });

  // copy all files
  allComponentFiles.forEach((file) => {
    fDest = file.replace(componentsSrcRoot, componentsDestRoot);
    mkdirp.sync(path.dirname(fDest));
    copyFileSync(file, fDest);
  });
}

function copyIndex() {
  console.log('Copy index.html file');
  writeFileSync('./assets/index.html', './dist/index.html');
}

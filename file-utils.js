const fs = require('fs').promises;
const path = require('path');
const glob = require('glob-all');
const mkdirp = require('mkdirp');
const { writeFileSync } = require('fs');
const copyFileSync = require('fs').copyFileSync;

module.exports = {
  createAngularBindingFile,
  extractAssetsFromIndexPug,
  copyReplacements,
  copyComponents
}

async function createAngularBindingFile(SOURCEDIR) {
  console.log('Creating AngularJS binding file for webpack');
  const fileFullPath = path.resolve(`${SOURCEDIR}`, 'angular-common.js');
  const fileContents = `require('angular/angular.js');

module.exports = window.angular;
`

  return fs.writeFile(fileFullPath, fileContents);
}


async function extractAssetsFromIndexPug(indexHTML) {
  console.log('extracting javascript assets from esn/index.pug');
  const staticAssets = [];
  const indexHTMLContents = await fs.readFile(indexHTML, { encoding: 'utf8' });
  indexHTMLContents.split('\n').forEach(l => {
    const line = l.trim();
    if (line.startsWith('script(src=') && !line.match(/\$\{/)) {
      const fPath = line.replace('script(src=\'', '').replace('\')', '');
      if (fPath === 'js/constants.js') {
        return;
      }
/*      if (fPath.endsWith('.min.js')) {
        staticAssets.push(fPath.replace('.min.js', '.js'));
        return;
      }*/
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

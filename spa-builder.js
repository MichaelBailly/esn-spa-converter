const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob-all');
const copyDir = require('copy-dir');
const replace = require('replace-in-file');

const {
  cleanSourceDir,
  extractAssetsFromCoreModules,
  extractAssetFromDependenceModules
} = require('./file-utils');
const { dependenceModules } = require('./constants');

class SpaBuilder {
  constructor(spa) {
    this.spa = spa;

    this.SOURCEDIR = path.resolve(__dirname, 'src');
    this.dirname = __dirname;
    this.esnPath = 'node_modules/linagora-rse';
    this.dependantModulesBase = path.resolve(this.dirname, 'node_modules');
  }

  build() {
    cleanSourceDir(this.SOURCEDIR);
    const coreModulesData = extractAssetsFromCoreModules(this.spa.coreModules);
    const depedentModulesData = extractAssetFromDependenceModules(this.spa.dependenceModules);
    const allAwesomeModuleAngularModuleNames = this.getAngularModuleNames(coreModulesData, depedentModulesData);
    const allAwesomeModulesJsFiles = this.getModulesJsFiles(coreModulesData, depedentModulesData);
    const allAwesomeModulesLessEntries = this.getModulesLessEntryFiles(this.spa.coreModules, this.spa.depedenceModules);

    this.copyAwesomeModulesFrontend(this.spa.coreModules, this.spa.dependenceModules);
    this.fixLessImports();
    this.createAngularInjectionsFile(allAwesomeModuleAngularModuleNames);
    this.createLessFile(allAwesomeModulesLessEntries);
    this.createIndexJsFile(allAwesomeModulesJsFiles);
    //console.log(coreModulesData);
    //console.log(depedentModulesData);
  }

  fixLessImports() {
    replace.sync({
      files: `${this.SOURCEDIR}/**/*.less`,
      from: /\.\.\/\.\.\/\.\.\/\.\.\/frontend\/components\/material-admin/g,
      to: '~esn-frontend-common-libs/src/frontend/components/material-admin'
    });
  }

  createIndexJsFile(allAwesomeModulesJsFiles) {
    const file = path.resolve(this.SOURCEDIR, 'index.js');
    let fileContents = 'require(\'esn-frontend-common-libs/src/index.js\');\n\n';
    allAwesomeModulesJsFiles.forEach((file) => {
      fileContents += `require ('./${file}');\n`;
    });
    fileContents += 'require(\'./all.less\');\n',
    fs.writeFileSync(file, fileContents);
  }

  createLessFile(entries) {
    const file = path.resolve(this.SOURCEDIR, 'all.less');
    let fileContents = '@import "~esn-frontend-common-libs/src/all.less";\n\n';
    entries.forEach((file) => {
      fileContents += `@import "./${file}";\n`;
    });

    fs.writeFileSync(file, fileContents);
  }

  createAngularInjectionsFile(allAwesomeModuleAngularModuleNames) {
    const file = path.resolve(this.SOURCEDIR, 'angular-injections.js');
    let fileContents = 'const injections = require(\'esn-frontend-common-libs/src/angular-injections.js\');\n\n';
    allAwesomeModuleAngularModuleNames.forEach(name => {
      fileContents += `injections.push("${name}");\n`;
    });
    fileContents += `\nmodule.exports = injections;\n`;

    fs.writeFileSync(file, fileContents);
  }


  getModulesLessEntryFiles(coreModules, dm) {
    const result = [];
    const dependenceModules = dm || [];
    coreModules.concat(dependenceModules).forEach((mod) => {
      if (!mod.cssRoot) {
        return;
      }
      const css = Array.isArray(mod.cssRoot) ? mod.cssRoot : [mod.cssRoot];
      css.forEach(f => result.push(f.replace('frontend/', `${mod.name}/`)));
    });

    return result;
  }

  getModulesJsFiles(coreModulesData, depedenceModulesData) {
    let result = coreModulesData.files.map((f) => {
      const base = f.replace(path.resolve(this.esnPath, 'modules') + '/', '');
      const modName = base.split('/').shift();
      return base.replace(`${modName}/frontend`, modName);
    });

    if (depedenceModulesData) {
      depedenceModulesData.forEach((mod) => {
        mod.files.forEach((f) => {
          const base = f.replace(this.dependantModulesBase + '/', '');
          result.push(base.replace(`${mod.mod.name}/frontend`, mod.mod.name));
        });

      });
    }
    console.log(result.join('\n'));
    return result;
  }

  copyAwesomeModulesFrontend(coreModules, dependenceModules) {
    coreModules.forEach((mod) => {
      const srcPath = path.resolve(this.dirname, this.esnPath, 'modules', mod.name, 'frontend');
      const destPath = path.resolve(this.SOURCEDIR, mod.name);
      copyDir.sync(srcPath, destPath);
    });

    const deps = dependenceModules || [];

    deps.forEach((mod) => {
      console.log('copy', mod.name);
      const srcPath = path.resolve(this.dependantModulesBase, mod.name, 'frontend');
      const destPath = path.resolve(this.SOURCEDIR, mod.name);
      copyDir.sync(srcPath, destPath);
    });
  }

  getAngularModuleNames(coreModulesData, depedentModulesData) {
    let result = [...coreModulesData.angularModulesName];
    if (depedentModulesData) {
      result = result.concat(
        depedentModulesData.map(m => m.angularModulesName).reduce((acc, val) => acc.concat(val), []) // this is ".flatten"
      );
    }

    return result;
  }

}

module.exports = SpaBuilder;

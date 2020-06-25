const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob-all');
const copyDir = require('copy-dir');
const replace = require('replace-in-file');
const CommonLibsBuilder = require('./common-libs-builder');

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
    this.commonLibsBuilder = new CommonLibsBuilder(this.SOURCEDIR);
    this.esnPath = 'node_modules/linagora-rse';
    this.dependantModulesBase = path.resolve(this.dirname, 'node_modules');
    this.bowerOrphanedRoot = path.resolve(this.SOURCEDIR, 'components');
  }

  build() {
    cleanSourceDir(this.SOURCEDIR);
    const coreModulesData = extractAssetsFromCoreModules(this.spa.coreModules);
    const depedentModulesData = extractAssetFromDependenceModules(this.spa.dependenceModules);
    const allAwesomeModuleAngularModuleNames = this.getAngularModuleNames(coreModulesData, depedentModulesData);
    const allAwesomeModulesJsFiles = this.getModulesJsFiles(coreModulesData, depedentModulesData);
    const allAwesomeModulesLessEntries = this.getModulesLessEntryFiles(this.spa.coreModules, this.spa.dependenceModules);

    this.copyAwesomeModulesFrontend(this.spa.coreModules, this.spa.dependenceModules);
    this.copyBowerOrphanedComponents();
    this.fixLessImports();
    this.createAngularInjectionsFile(allAwesomeModuleAngularModuleNames);
    this.createLessFile(allAwesomeModulesLessEntries);
    this.createIndexJsFile(allAwesomeModulesJsFiles);
    this.createModuleMetaFile(coreModulesData, depedentModulesData);
  }

  createModuleMetaFile() {
    fs.writeFileSync(path.resolve(this.SOURCEDIR, 'module-info.json'), JSON.stringify(this.spa, null, 2));
  }

  fixLessImports() {
    replace.sync({
      files: `${this.SOURCEDIR}/**/*.less`,
      from: /\.\.\/\.\.\/\.\.\/\.\.\/frontend\/components\/material-admin/g,
      to: '~esn-frontend-common-libs/src/frontend/components/material-admin'
    });

    '../../../unifiedinbox/images/select.png'
    replace.sync({
      files: `${this.SOURCEDIR}/**/*.less`,
      from: /\.\.\/\.\.\/\.\.\/unifiedinbox\/images\/select.png/g,
      to: '../../images/select.png'
    });
  }

  createIndexJsFile(allAwesomeModulesJsFiles) {
    const file = path.resolve(this.SOURCEDIR, 'index.js');
    let fileContents = '';

    fileContents += this.getNpmModulesJavaScript();
    fileContents += this.getBowerOrphanedJavaScript();

    fileContents += '\nrequire(\'esn-frontend-common-libs/src/index.js\');\n\n';
    fileContents += '\nrequire(\'./require-angular-injections.js\');\n\n';
    allAwesomeModulesJsFiles.forEach((file) => {
      fileContents += `require ('./${file}');\n`;
    });
    fileContents += 'require(\'./all.less\');\n',
    fs.writeFileSync(file, fileContents);
  }

  createLessFile(entries) {
    const file = path.resolve(this.SOURCEDIR, 'all.less');
    let fileContents = '';

    fileContents += this.getNpmModulesLess();
    fileContents += this.getBowerOrphanedLess();

    fileContents += '@import "~esn-frontend-common-libs/src/all.less";\n\n';
    entries.forEach((file) => {
      fileContents += `@import "./${file}";\n`;
    });

    fs.writeFileSync(file, fileContents);
  }

  createAngularInjectionsFile(allAwesomeModuleAngularModuleNames) {
    const file = path.resolve(this.SOURCEDIR, 'require-angular-injections.js');
    let fileContents = 'const injections = require(\'esn-frontend-common-libs/src/require-angular-injections.js\');\n\n';
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
    return result;
  }

  copyAwesomeModulesFrontend(coreModules, dependenceModules) {
    coreModules.forEach((mod) => {
      console.log('copy', mod.name);
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
    return this.commonLibsBuilder.getAngularModuleNames(coreModulesData, depedentModulesData);
  }

  getNpmModulesJavaScript() {
    let result = '';
    if (!this.spa.EX_BOWER || !this.spa.EX_BOWER.length) {
      return result;
    }

    this.spa.EX_BOWER.forEach((mod) => {
      if (!mod.file) {
        return;
      }
      const files = Array.isArray(mod.file) ? mod.file : [ mod.file ];
      files.forEach((f) => {
        console.log('npm dep: add require', mod.name, f);
        result += `require('${mod.name}/${f}');\n`;
      });
    });

    return result;
  }

  getBowerOrphanedJavaScript() {
    let result = '';
    if (!this.spa.BOWER_ORPHANED || !this.spa.BOWER_ORPHANED.length) {
      return result;
    }

    this.spa.BOWER_ORPHANED.forEach((mod) => {
      if (!mod.file) {
        return;
      }
      const files = Array.isArray(mod.file) ? mod.file : [mod.file];
      files.forEach((f) => {
        console.log('bower dep: add require', mod.name, f);
        result += `require('./components/${mod.name}/${f}');\n`;
      });
    });

    return result;
  }

  getNpmModulesLess() {
    let result = '';
    if (!this.spa.EX_BOWER || !this.spa.EX_BOWER.length) {
      return result;
    }

    this.spa.EX_BOWER.forEach((mod) => {
      if (!mod.css) {
        return;
      }
      const files = Array.isArray(mod.css) ? mod.css : [mod.css];
      files.forEach((f) => {
        result += `@import "~${mod.name}/${f}";\n`;
      });
    });

    return result;
  }

  getBowerOrphanedLess() {
    let result = '';
    if (!this.spa.BOWER_ORPHANED || !this.spa.BOWER_ORPHANED.length) {
      return result;
    }

    this.spa.BOWER_ORPHANED.forEach((mod) => {
      if (!mod.css) {
        return;
      }
      const files = Array.isArray(mod.css) ? mod.css : [mod.css];
      files.forEach((f) => {
        result += `@import "./components/${mod.name}/${f}";\n`;
      });
    });

    return result;
  }

  copyBowerOrphanedComponents() {
    if (!this.spa.BOWER_ORPHANED || !this.spa.BOWER_ORPHANED.length) {
      return;
    }
    mkdirp.sync(this.bowerOrphanedRoot);
    this.spa.BOWER_ORPHANED.forEach((mod) => {
      const srcDir = path.resolve(this.dependantModulesBase, mod.in, 'frontend', 'components', mod.name);
      console.log('copy', mod.name, srcDir, this.bowerOrphanedRoot);
      copyDir.sync(srcDir, path.resolve(this.bowerOrphanedRoot, mod.name));
    });
  }
}

module.exports = SpaBuilder;

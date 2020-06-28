const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const glob = require('glob-all');
const copyDir = require('copy-dir');
const rimraf = require('rimraf');
const replace = require('replace-in-file');
const pug = require('pug');
const CommonLibsBuilder = require('./common-libs-builder');

const {
  cleanSourceDir,
  extractAssetsFromCoreModules,
  extractAssetFromDependenceModules,
  extractAssetsFromAwesomeModule,
  replacePugCallsToAngularTranslate,
  resolveTemplateFromNgTemplateUrl
} = require('./file-utils');
const { dependenceModules } = require('./constants');

class SpaBuilder {
  constructor(spa) {
    this.spa = spa;
    this.warnings = [];
    this.SOURCEDIR = path.resolve(__dirname, 'src');
    this.dirname = __dirname;
    this.commonLibsBuilder = new CommonLibsBuilder(this.SOURCEDIR);
    this.esnPath = 'node_modules/linagora-rse';
    this.commonLibsPath = 'node_modules/esn-frontend-common-libs';
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
    this.spa.coreModules.forEach((mod) => this.fixPug(mod));
    if (this.spa.dependenceModules) {
      this.spa.dependenceModules.forEach((mod) => this.fixPug(mod));
    }
    this.spa.coreModules.forEach((mod) => this.setRequirePugInAngular(mod));
    if (this.spa.dependenceModules) {
      this.spa.dependenceModules.forEach((mod) => this.setRequirePugInAngular(mod));
    }

    this.createAngularInjectionsFile(allAwesomeModuleAngularModuleNames);
    this.createLessFile(allAwesomeModulesLessEntries);
    this.createIndexJsFile(allAwesomeModulesJsFiles);
    this.createModuleMetaFile(coreModulesData, depedentModulesData);

    console.log('### Process is complete ###');
    this.displayWarnings();
  }

  displayWarnings() {
    if (!this.warnings.length) {
      return;
    }
    console.log('');
    console.log('The process encountered anomalies that a real human need to investigate:');
    console.log('');
    console.log(this.warnings.join('\n---------------------------------------------\n'));
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

    replace.sync({
      files: `${this.SOURCEDIR}/**/*.less`,
      from: /\.\.\/components\/material-admin/g,
      to: '~esn-frontend-common-libs/src/frontend/components/material-admin'
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

      // remove "bower" components folder from source
      // useful bower module will be reinstalled
      rimraf.sync(path.resolve(destPath, 'components'));
    });

    const deps = dependenceModules || [];

    deps.forEach((mod) => {
      console.log('copy', mod.name);
      const srcPath = path.resolve(this.dependantModulesBase, mod.name, 'frontend');
      const destPath = path.resolve(this.SOURCEDIR, mod.name);
      copyDir.sync(srcPath, destPath);

      // remove "bower" components folder from source
      // useful bower module will be reinstalled
      rimraf.sync(path.resolve(destPath, 'components'));
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

  fixPug(mod) {
    console.log('Rewriting pug files');
    const moduleRoot = path.resolve(this.SOURCEDIR, mod.name);
    const pugFiles = glob.sync(mod.pugGlob.map((e) => {
      if (e.startsWith('!')) {
        return `!${moduleRoot}/${e.substr(1)}`;
      } else {
        return `${moduleRoot}/${e}`
      }
    }));
    const renderOps = [];
    const pugOptions = mod.pugOptions ? { ...mod.pugOptions} : {};
    if (pugOptions.basedir) {
      pugOptions.basedir = path.resolve(this.dirname, pugOptions.basedir);
    }

    pugFiles.forEach((f) => {
      let fileContents = fs.readFileSync(f, 'utf8');
      fileContents = replacePugCallsToAngularTranslate(fileContents, (warning) => this.warnings.push(warning + `File: ${f}\n`));
      renderOps.push(renderOp(fileContents, pugOptions, f));
      fs.writeFileSync(f, fileContents);
    });

    while (renderOps.length) {
      renderOps.shift()();
    }

    function renderOp(fileContents, pugOptions, filename) {
      const options = { ...pugOptions, filename };
      return () => {
        try {
          pug.render(fileContents, options);
        } catch (e) {
          console.log('pug file rendering failed');
          console.log('file', filename);
          console.log('contents', fileContents);
          throw e;
        }
      }
    }
  }

  setRequirePugInAngular(mod) {
    console.log('Set require(\'...pug\') in javascrit code');
    const baseAssetsRoot = `src/${mod.name}/${mod.fileRoot.replace('frontend/', '')}`;
    const allJsFiles = extractAssetsFromAwesomeModule(mod, baseAssetsRoot).files;
    const mappings = [
      {
        from: '/modules/',
        to: path.resolve(this.dirname, this.commonLibsPath, 'src/frontend/js/modules')
      },
      {
        from: `/${mod.shortName}/app/`,
        to: path.resolve(this.SOURCEDIR, mod.name, 'app')
      },
      {
        from: `/${mod.shortName}/views/`,
        to: path.resolve(this.SOURCEDIR, mod.name, 'views')
      },
    ];
    allJsFiles.forEach((f) => {
      let fileContents = fs.readFileSync(f, 'utf8');
      fileContents = fileContents.replace(/(templateUrl:\s+'([^']+)')/g, (match, p1, p2) => {
        if (p2 === '/unifiedinbox/app/components/composer/boxed/composer-boxed.html') {
          this.warnings.push(`In the task moving from "templateUrl: string" to "template: require('pugfile')"

The templateUrl has not been changed for path ${p2}. This would break application.
BoxOVerlay system should support "template" attriute before updating this line.
`);
          return match;
        } else if (p2 === '/calendar/app/search/event/event-search-item.html') {
          this.warnings.push(`In the task moving from "templateUrl: string" to "template: require('pugfile')"

The templateUrl has not been changed for path ${p2}. This would break application.
BoxOVerlay system should support "template" attriute before updating this line.
`);
          return match;
        } else if (p2 === '/contact/app/search/contact-search.html') {
          this.warnings.push(`In the task moving from "templateUrl: string" to "template: require('pugfile')"

The templateUrl has not been changed for path ${p2}. This would break application.
BoxOVerlay system should support "template" attriute before updating this line.
`);
          return match;
        }
        let pugFile;
        try {
          pugFile = resolveTemplateFromNgTemplateUrl(p2, mappings);
        } catch(e) {
          console.log('Angular File :', f);
          this.warnings.push(`In the task moving from "templateUrl: string" to "template: require('pugfile')"
For file: ${f}
Pug template file could not be found. templateUrl=${p2}
Leaving original content "${match}"
`);
          return match;
        }
        let relativePath = path.relative(path.dirname(f), path.dirname(pugFile));
        if (relativePath.length && !relativePath.startsWith('.')) {
          relativePath = `./${relativePath}`;
        } else if (!relativePath.length) {
          relativePath = './';
        }
        const back = `template: require("${relativePath}/${path.basename(pugFile)}")`;
        return back;
      });
      fs.writeFileSync(f, fileContents);
    });
  }
}

module.exports = SpaBuilder;

const path = require('path');
const glob = require('glob-all');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const pug = require('pug');


const { writeFileSync, readFileSync, copyFileSync, accessSync } = require('fs');
const ACCESS_READ = require('fs').constants.R_OK;
const coreFrontEndInjections = require('./node_modules/linagora-rse/backend/webserver/core-frontend-injections');
const copyDir = require('copy-dir');
const { exit } = require('process');
const { inflateRaw } = require('zlib');

module.exports = {
  createAngularBindingFile,
  extractAssetsFromIndexPug,
  copyReplacements,
  copyComponents,
  extractAssetsFromCoreInjections,
  cleanSourceDir,
  extractAssetFromDependenceModules,
  extractAssetsFromCoreModules,
  copyCoreModules,
  createCoreModulesRequireFiles,
  copyCoreAssetViews,
  replacePugCallsToAngularTranslate,
  extractAssetsFromAwesomeModule,
  resolveTemplateFromNgTemplateUrl
}

function copyCoreAssetViews(rootDir, sourceDir) {
  const viewroot = path.resolve(rootDir, 'node_modules', 'linagora-rse', 'frontend');
  const viewdest = path.resolve(sourceDir, 'frontend');

  const allPugs = glob.sync([`${viewroot}/**/*.pug`]);
  allPugs.forEach((f) => {
    let fileContents = readFileSync(f, 'utf8');
    if (f.endsWith('frontend/views/commons/utils.pug') ||
      f.endsWith('frontend/views/esn/index.pug') ||
      f.endsWith('frontend/views/modules/login/home.pug') ||
      f.endsWith('frontend/views/modules/login/login.pug') ||
      f.endsWith('frontend/views/setup/index.pug') ||
      f.endsWith('frontend/views/password-reset/index.pug') ||
      f.endsWith('frontend/views/password-reset/partials/home.pug') ||
      f.endsWith('frontend/views/welcome/index.pug') ||
      f.endsWith('frontend/views/welcome/partials/home.pug') ||
      f.endsWith('frontend/views/commons/404.pug') ||
      f.endsWith('frontend/views/oauth/index.pug') ||
      f.endsWith('frontend/views/oauth/dialog.pug')
    ) {
      return;
    }
    fileContents = replacePugCallsToAngularTranslate(fileContents);

    const html = pug.render(fileContents, {
      filename: f
    });

    const fdest = f.replace(viewroot, viewdest);

    mkdirp.sync(path.dirname(fdest));
    writeFileSync(fdest, fileContents);
  });
}

function replacePugCallsToAngularTranslate(fileContents, onWarning) {
  onWarning = onWarning || function() {};
  return fileContents
    // case | "#{__('Unified Inbox')}" |
    .replace(/\| "#{__\('([^']+)'\)\}" \|/g, (match, message) => {
      const quoted = quoteMessage(message, "'");
      return `| '${quoted}' | translate |`;
    })
    // case | '#{__("This must be less than or equal to")} ' +
    .replace(/\| '#{__\("([^"]+)"\)\} ' \+/g, (match, message) => {
      const quoted = quoteMessage(message, "'");
      return `| '${quoted}' | translate }} {{`;
    })
    // case '#{__("MESSAGE")}'
    .replace(/'#{__\("([^"]+)"\)\}'/g, (match, message) => {
      const quoted = quoteMessage(message, "'");
      return `'${quoted}' | translate`;
    }) // case #{__("MESSAGE")}
    .replace(/#{__\("([^"]+)"\)\}/g, (match, message) => {
      const quoted = quoteMessage(message, "'");
      return `{{ '${quoted}' | translate }}`;
    })
    // case #{__('MESSAGE')}
    .replace(/#{__\('([^']+)'\)\}/g, (match, message) => {
      const quoted = quoteMessage(message, "'");
      return `{{ '${quoted}' | translate }}`;
    })
    // case __("MESSAGE")
    .replace(/__\("([^"]+)"\)/g, (match, message) => {
      const quoted = quoteMessage(message, "'");
      return `"{{ '${quoted}' | translate }}"`;
    })
    // case __('MESSAGE')
    .replace(/__\('([^']+)'\)/g, (match, message) => {
      const quoted = quoteMessage(message, "'");
      return `"{{ '${quoted}' | translate }}"`;
    })
    // case #{__('message', '{{ ::$ctrl.humanReadableMaxSizeUpload }}')}
    .replace(/(#{__\('([^']+)',\s*'([^']+)'\)\})/g, (match, message, message2, message3) => {

      let ngVar = message3.replace(/(.*)(\{\{\s*:*)/, '');
      ngVar = ngVar.replace(/}}.*$/, '').trim();
      const quoted = quoteMessage(message2, "'");
      const result = `{{ '${quoted}' | translate:${ngVar} }}`;
      onWarning(warningMessage(match, result));
      return result;
    })
    // case #{__("message", "{{ ::$ctrl.humanReadableMaxSizeUpload }}")}
    .replace(/(#{__\("([^"]+)",\s+"([^"]+)"\)\})/g, (match, message, message2, message3) => {
      let ngVar = message3.replace(/(.*)(\{\{::)/, '');
      ngVar = ngVar.replace(/}}.*$/, '').trim();
      const quoted = quoteMessage(message2, "'");
      const result = `{{ '${quoted}' | translate:${ngVar} }}`;
      onWarning(warningMessage(match, result));
      return result;
    })
    // case !{__('No application, click %s to add a new one', '<span class="mdi mdi-plus"></span>')}
    .replace(/(!{__\('([^']+)',\s+'([^']+)'\)\})/g, (match, message, message2, message3) => {
      let ngVar = message3.replace(/(.*)(\{\{::)/, '');
      ngVar = ngVar.replace(/}}.*$/, '').trim();
      const quoted = quoteMessage(message2, "'");
      const result = `{{ '${quoted}' | translate:${ngVar} }}`;
      onWarning(warningMessage(match, result));
      return result;
    })
    // case #{__('This will unsubscribe you from the "%s" calendar.', "{{::ctrl.calendarName}}")}
    .replace(/#{__\('([^"]+"[^"]+"[^']+)',\s+"{{::([^"]+)}}"\)\}/g, (match, message, message2, message3) => {
      const quoted = quoteMessage(message, "'");
      const result = `{{ '${quoted}' | translate:${message2} }}`;
      onWarning(warningMessage(match, result));
      return result;
    }) // case #{__(MESSAGE)}
    .replace(/#{__\(([^\)]+)\)\}/g, (match, message) => {
      return `{{ ${message} | translate }}`;
    }) // case #{__('Your vacation responder will be activated on %s', "{{ ::vacation.fromDate.toDate() | esnDatetime:'mediumDate time' }}")}
    .replace(/(#{__\('([^']+)',\s+"([^"]+)"\)\})/g, (match, message, message2, message3) => {
      const quoted = quoteMessage(message2, "'");
      const result = `{{ '${quoted}' | translate }} ${message3}`;
      onWarning(warningMessage(match, result));
      return result;
    })
    ;

  function quoteMessage(message, _quoteStyle) {
    return message.replace(/'/g, "\\'");
  }

  function warningMessage(match, result) {
    return `In the task changing pug i18n calls __() with angular translate {{ 'thing' | translate }}
The expression
${match}
will be replaced by
${result}

That will not work. The code should be updated to use Angular Translate way of passing arguments
See https://angular-translate.github.io/docs/#/api/pascalprecht.translate.filter:translate
`;
  }
}

function copyCoreModules(rootDir, sourceDir, coreModules) {
  coreModules.forEach((mod) => {
    const srcdir = path.resolve(rootDir, 'node_modules', 'linagora-rse', 'modules', mod.name, 'frontend');
    const dstdir = path.resolve(sourceDir, 'modules', mod.name, 'frontend');
    mkdirp.sync(dstdir);
    copyDir.sync(srcdir, dstdir);
  });
}

function createCoreModulesRequireFiles(sourceDir, coreModules) {
  coreModules.forEach((mod) => {
    const modRoot = path.resolve(sourceDir, 'modules', mod.name);
    const fileRoot = path.resolve(modRoot, mod.fileRoot);
    const assets = extractAssetsFromAwesomeModule(mod, fileRoot);

    let fileContents = 'require(\'../../frontend/index.js\');\n';
    fileContents += 'require(\'./require-angular-injections.js\');\n';
    assets.files.map(f => f.replace(modRoot, '.')).forEach((f) => {
      fileContents += `require('${f}');\n`;
    });
    filePath = path.resolve(modRoot, 'index.js');
    writeFileSync(filePath, fileContents);
  });
}

function cleanSourceDir(sourceDir) {
  rimraf.sync(sourceDir);
  mkdirp.sync(sourceDir);
}

function extractAssetsFromCoreInjections() {
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
function extractAssetFromDependenceModules(dependenceModules) {
  const result = [];
  if (!dependenceModules) {
    return result;
  }
  dependenceModules.forEach((mod) => {
    const modLocalPath = `node_modules/${mod.name}/${mod.fileRoot}`;
    const tmpResult = extractAssetsFromAwesomeModule(mod, modLocalPath);
    result.push(tmpResult);
  });
  return result;
}

function extractAssetsFromCoreModules(coreModules) {
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

/*
  resolve a pug file, starting with a 'templateUrl' string
  mappings: [
    {
      from: '/views',
      to: path.resolve()
    }
  ]
  */
function resolveTemplateFromNgTemplateUrl(templateUrl, mappings, srcDir = null) {
  let pugFile;

  if (srcDir) {
    pugFile = `${srcDir}/${path.basename(templateUrl).replace('.html', '.pug')}`;
    try {
      accessSync(pugFile, ACCESS_READ);
      return pugFile;
    } catch (e) { }
  }

  const candidate = [];
  mappings.forEach((mapping) => {
    pugFile = templateUrl;
    const tmparray = pugFile.split(mapping.from);
    tmparray.shift();
    const suffix = tmparray.join(mapping.from);
    const targetFileUrl = path.resolve(mapping.to, suffix);

    if (suffix.length) {
      pugFile = targetFileUrl;
      pugFile = pugFile.replace(/\.html$/, '.pug');
      if (!pugFile.endsWith('.pug')) {
        pugFile += '.pug';
      }
      try {
        accessSync(pugFile, ACCESS_READ);
        candidate.push(pugFile);
      } catch (e) { }
    }
  });

  if (!candidate.length) {
    console.log('templateUrl =', templateUrl);
    throw new Error('cannot find pug file for "' + templateUrl + '"');
  }
  if (candidate.length > 1) {
    throw new Error('more than 1 pug file for ' + templateUrl + ' ' + candidate.join(', '));
  }

  return candidate[0];
}

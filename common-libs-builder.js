const path = require('path');
const fs = require('fs');

const CONSTANTS = require('./constants');

class CommonLibsBuilder {
  constructor(SOURCEDIR) {
    this.SOURCEDIR = SOURCEDIR;
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

  createAngularInjectionsFile(angularModulesName, { filePath = 'require-angular-injections.js', requireRoot = 'esn-frontend-common-libs/src/require-angular-injections.js'}) {
    const file = path.resolve(this.SOURCEDIR, filePath);
    let fileContents = `const injections = require('${requireRoot}');\n\n`;
    angularModulesName.forEach(name => {
      fileContents += `injections.push("${name}");\n`;
    });
    fileContents += `\nmodule.exports = injections;\n`;
    fs.writeFileSync(file, fileContents);
  }
}

module.exports = CommonLibsBuilder;

module.exports = {
  account: {
    coreModules: [
      {
        name: 'linagora.esn.controlcenter',
        angularModuleName: 'linagora.esn.controlcenter',
        frontendRoot: 'frontend',
        cssRoot: 'frontend/app/app.less',
        fileRoot: 'frontend/app',
        filesGlob: [
          '**/*.module.js',
         '**/!(*spec).js'
       ]
     },
      {
        name: 'linagora.esn.profile',
        angularModuleName: 'linagora.esn.profile',
        fileRoot: 'frontend/app',
        filesGlob: [
          '**/*.module.js',
          '**/!(*spec).js'
        ]
      }
    ]
  }, // en of account SPA
  contacts: {
    coreModules: [
      {
        name: 'linagora.esn.contact',
        angularModuleName: 'linagora.esn.contact',
        frontendRoot: 'frontend',
        cssRoot: 'frontend/app/app.less',
        fileRoot: 'frontend/app',
        filesGlob: [
          `**/*.module.js`,
         `**/!(*spec).js`
        ]
      },
      {
        name: 'linagora.esn.contact.import',
        angularModuleName: 'linagora.esn.contact.import',
        fileRoot: 'frontend/js',
        files: ['app.js', 'constants.js', 'services.js']
      }
    ],
    dependenceModules: [
      {
        name: 'linagora.esn.dav.import',
        angularModuleName: 'linagora.esn.dav.import',
        fileRoot: 'frontend/app',
        filesGlob: [
          '**/*.module.js',
          '**/!(*spec).js'
        ]
      },
    ]
  }
}

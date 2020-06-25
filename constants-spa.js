module.exports = {
  calendar: {
    coreModules: [],
    dependenceModules: [
      {
        name: 'linagora.esn.calendar',
        angularModuleName: 'esn.calendar',
        frontendRoot: 'frontend/app',
        cssRoot: 'frontend/app/styles.less',
        fileRoot: 'frontend/app',
        filesGlob: [
          'app/app.js',
          '**/!(*spec).js'
        ]
      },
      {
        name: 'linagora.esn.resource',
        angularModuleName: 'linagora.esn.resource',
        frontendRoot: 'frontend/app',
        cssRoot: 'frontend/app/resource.less',
        fileRoot: 'frontend/app',
        filesGlob: [
          'app/app.js',
          '**/!(*spec).js'
        ]
      },
    ],
    EX_BOWER: [
      {
        name: 'fullcalendar',
        version: '3.9.0',
        file: [
          'dist/fullcalendar.js',
          'dist/locale-all.js',
        ],
        css: 'dist/fullcalendar.css',
      }
    ]
  },
  inbox: {
    coreModules: [],
    dependenceModules: [
      {
        name: 'linagora.esn.unifiedinbox',
        angularModuleName: 'linagora.esn.unifiedinbox',
        frontendRoot: 'frontend',
        cssRoot: 'frontend/app/inbox.less',
        fileRoot: 'frontend/app',
        filesGlob: [
          '**/!(*spec|mailto.config|mailto.constants|mailto|mailto.mocks|mailto.run).js',
          '!**/mailto/**',
          '!app.js'
        ]
      },
      {
        name: 'linagora.esn.james',
        angularModuleName: 'linagora.esn.james',
        frontendRoot: 'frontend',
        fileRoot: 'frontend/app',
        filesGlob: [
          '**/*.module.js',
          '**/!(*spec).js'
        ]
      }
    ],
    EX_BOWER: [
      {
        name: 'sanitize-html',
        version: 'linagora/sanitize-html#c89d4ebe09da48296f33cc80ddcc02e11d853265',
        file: [
          'dist/sanitize-html.js',
        ],
        isLinagora: true,
      },
      {
        name: 'angularjs-dragula',
        version: '2.0.0',
        file: [
          'dist/angularjs-dragula.js',
        ],
        css: 'dist/dragula.css',
      },
      {
        name: 'jmap-draft-client',
        in: 'linagora.esn.unifiedinbox',
        version: 'linagora/jmap-draft-client#0.1.2',
        file: 'dist/jmap-draft-client.js',
        isLinagora: true,
      },
      { // needed by linagora.esn.james
        name: 'ui-select',
        version: '0.19.8',
        file: [
          'dist/select.js',
        ],
        css: 'dist/select.css',
      },
    ],
    BOWER_ORPHANED: []
  },
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
      },
      {
        name: 'linagora.esn.davproxy',
        angularModuleName: 'linagora.esn.davproxy',
        fileRoot: 'frontend/js',
        filesGlob: [
          '**/*.module.js',
          '**/!(*spec).js'
        ]
      },
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

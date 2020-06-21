module.exports = {
  EXCLUDE_FROM_COPY: [
    './angular-common.js',
    './angular-injections.js',
    '/socket.io/socket.io.js'
  ],
  coreInjectionsFiles: [
    'js/modules/attachment/attachment.less',
    'js/modules/user-notification/user-notification.less',
    'js/modules/chips/chips.less',
    'js/modules/box-overlay/box-overlay.less',
    'js/modules/follow/follow.less',
    'js/modules/message/message.less',
    'js/modules/oauth-application/oauth-application.less',
    'js/modules/search/search.less',
    'js/modules/datetime/datetime.less',
    'js/modules/shortcuts/shortcuts.less',
    'js/modules/clipboard/clipboard.less',
    'js/modules/file-browser/file-browser.less',
    'js/modules/attachments-selector/attachments-selector.less',
    'js/modules/timeline/timeline.less',
    'js/modules/attachment/list/attachment-list.less',
    'js/modules/attachment/viewer/attachment-viewer.less',
    'js/modules/collaboration/membership/collaboration-membership.less',
    'js/modules/collaboration/members/collaboration-members.less',
    'js/modules/collaboration/member/collaboration-member.less',
    'js/modules/collaboration/members/collaboration-members-widget.less',
    'js/modules/collaboration/invite/collaboration-invite-users.less',
    'js/modules/avatar/list/avatar-list.less',
    'js/modules/header/profile-menu/profile-menu.less',
    'js/modules/form-helper/filter-input/filter-input.less',
    'js/modules/i18n/language-selector/i18n-language-selector.less',
    'js/modules/profile-popover-card/profile-popover-content/profile-popover-content.less',
    'js/modules/form-helper/email-input/email-input.less',
    'js/modules/collaboration/members/list/collaboration-members-list.less',
    'js/modules/collaboration/members/add/collaboration-members-add.less',
    'js/modules/collaboration/members/add/add-item/collaboration-members-add-item.less',
    'js/modules/user-notification/popover/user-notification-popover.less',
    'js/modules/user-notification/list/user-notification-list.less',
    'js/modules/user-notification/toggler/user-notification-toggler.less',
    'js/modules/follow/list/follower-list.less',
    'js/modules/message/attachments/attachments.less',
    'js/modules/oauth-application/card/oauth-application-card.less',
    'js/modules/oauth-application/list/oauth-application-list.less',
    'js/modules/search/header/search-header.less',
    'js/modules/search/provider-select/search-provider-select.less',
    'js/modules/datetime/timeformat-selector/timeformat-selector.less',
    'js/modules/datetime/time-zone-selector/time-zone-selector.less',
    'js/modules/shortcuts/sheet/shortcuts-sheet.less',
    'js/modules/clipboard/url/clipboard-url.less',
    'js/modules/user-notification/list/item/user-notification-list-item.less',
    'js/modules/oauth-application/form/add/oauth-application-add-form.less',
    'js/modules/search/form/advanced/search-advanced-form.less',
    'js/modules/search/form/advanced/search-advanced-form-content.less',
    'js/modules/attachment/viewer/default-viewer/default-viewer.less',
    'js/modules/attachment/viewer/image-viewer/image-viewer.less',
    'js/modules/attachment/viewer/video-viewer/video-viewer.less',
    'js/modules/attachment/preview/image-preview/image-preview.less',
    'js/modules/attachment/preview/default-preview/default-preview.less'
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
  ],
  coreModules: [
    {
      name: 'linagora.esn.account',
      angularModuleName: 'linagora.esn.account',
      frontendRoot: 'frontend',
      cssRoot: 'frontend/css/styles.less',
      fileRoot: 'frontend/js',
      files: [
        'app.js',
        'app.run.js',
        'constants.js',
        'controllers.js',
        'directives.js',
        'services.js'
      ]
    },/*
    {
      name: 'linagora.esn.contact',
      angularModuleName: 'linagora.esn.contact',
      frontendRoot: 'frontend',
      cssRoot: 'frontend/app/app.less',
      fileRoot: 'frontend/app',
      filesGlob: [*/
//        `**/*.module.js`,
//        `**/!(*spec).js`
      /*]
    },*/
    {
      name: 'linagora.esn.contact.import',
      angularModuleName: 'linagora.esn.contact.import',
      fileRoot: 'frontend/js',
      files: ['app.js', 'constants.js', 'services.js']
    },
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
      name: 'linagora.esn.davproxy',
      angularModuleName: 'linagora.esn.davproxy',
      fileRoot: 'frontend/js',
      filesGlob: [
        '**/*.module.js',
        '**/!(*spec).js'
      ]
    },
    {
      name: 'linagora.esn.graceperiod',
      angularModuleName: 'linagora.esn.graceperiod',
      frontendRoot: 'frontend',
      cssRoot: 'frontend/css/styles.less',
      fileRoot: 'frontend/js',
      filesGlob: [
        '**/!(*spec).js'
      ]
    },
    {
      name: 'linagora.esn.jobqueue',
      angularModuleName: 'linagora.esn.jobqueue',
      frontendRoot: 'frontend',
      cssRoot: 'frontend/app/app.less',
      fileRoot: 'frontend/app',
      filesGlob: [
        '**/*.module.js',
        '**/!(*spec).js'
      ]
    },
    {
      name: 'linagora.esn.oauth.consumer',
      angularModuleName: 'linagora.esn.oauth.consumer',
      fileRoot: 'frontend/js',
      files: ['app.js', 'services.js']
    },
    {
      name: 'linagora.esn.profile',
      angularModuleName: 'linagora.esn.profile',
      fileRoot: 'frontend/app',
      filesGlob: [
        '**/*.module.js',
        '**/!(*spec).js'
      ]
    },
    {
      name: 'linagora.esn.user.status',
      angularModuleName: 'linagora.esn.user-status',
      frontendRoot: 'frontend',
      cssRoot: 'frontend/app/user-status.styles.less',
      fileRoot: 'frontend/app',
      filesGlob: [
        'app.js',
        '**/!(*spec).js'
      ]
    }
  ],

  /**
   * The list of modules that were previously fetched through bower,
   * and were it's now NPM that fetches them.
   */
  EX_BOWER: [
    {
      name: 'angular',
      version: '1.3.20',
      file: 'angular.js'
    },
    {
      name: 'angular-animate',
      version: '1.3.20',
      file: 'angular-animate.js'
    },
    {
      name: 'angular-aria',
      version: '1.5.8',
      file: 'angular-aria.js'
    },
    {
      name: 'angular-auto-focus',
      version: '1.0.4',
      file: 'angular-auto-focus.js'
    },
    {
      name: 'angular-chart.js',
      version: '0.5.1',
      file: 'angular-chart.js',
      css: 'dist/angular-chart.css'
    },
    {
      name: 'angular-feature-flags',
      version: '1.1.0',
      file: 'dist/featureFlags.js',
      bumpFrom: '1.0.0'
    },
    {
      name: 'angular-file-saver',
      version: '1.1.2',
      file: 'dist/angular-file-saver.bundle.js'
    },
    {
      name: 'angular-gist',
      version: '0.1.3',
      file: 'angular-gist.js'
    },
    {
      name: 'angular-i18n',
      version: '1.3.20',
      file: 'angular-locale_en.js' // warning i18n !
    },/* do not use npm version because we have to overwrite a file on it
    {
      name: 'angular-localforage',
      version: '1.2.2',
      file: 'dist/angular-localForage.js'
    },*/
    {
      name: 'angular-material',
      version: '1.1.3',
      file: [
        'modules/js/core/core.js',
        'modules/js/showHide/showHide.js',
        'modules/js/virtualRepeat/virtualRepeat.js',
        'modules/js/backdrop/backdrop.js',
        'modules/js/button/button.js',
        'modules/js/dialog/dialog.js',
        'modules/js/fabActions/fabActions.js',
        'modules/js/fabSpeedDial/fabSpeedDial.js',
        'modules/js/fabTrigger/fabTrigger.js',
        'modules/js/tooltip/tooltip.js',
        'modules/js/menu/menu.js',
        'modules/js/icon/icon.js',
        'modules/js/whiteframe/whiteframe.js',
        'modules/js/panel/panel.js',
        'modules/js/menuBar/menuBar.js',
        'modules/js/select/select.js',
        'modules/js/radioButton/radioButton.js',
        'modules/js/card/card.js',
      ],
      css: [
        'modules/js/core/core.min.css',
        'modules/js/virtualRepeat/virtualRepeat.min.css',
        'modules/js/backdrop/backdrop.min.css',
        'modules/js/button/button.min.css',
        'modules/js/dialog/dialog.min.css',
        'modules/js/fabSpeedDial/fabSpeedDial.min.css',
        'modules/js/tooltip/tooltip.min.css',
        'modules/js/menu/menu.min.css',
        'modules/js/icon/icon.min.css',
        'modules/js/whiteframe/whiteframe.min.css',
        'modules/js/panel/panel.min.css',
        'modules/js/menuBar/menuBar.min.css',
        'modules/js/select/select.min.css',
        'modules/js/radioButton/radioButton.min.css',
        'modules/js/card/card.min.css'
      ]
    },
    {
      name: 'angular-messages',
      version: '1.3.16',
      file: 'angular-messages.js'
    },
    // no angular-mocks in production
    {
      name: 'angular-moment',
      version: '1.0.0-beta.6',
      file: 'angular-moment.js'
    },
    {
      name: 'angular-motion',
      version: '0.4.4',
      file: null,
      css: 'dist/angular-motion.css'
    },
    {
      name: 'angular-promise-extras',
      version: '0.1.8',
      file: 'angular-promise-extras.js'
    },
    {
      name: 'angular-route',
      version: '1.3.20',
      file: 'angular-route.js'
    },
    {
      name: 'angular-sanitize',
      version: '1.3.20',
      file: 'angular-sanitize.js'
    },
    {
      name: 'angular-scroll',
      version: '0.7.0',
      file: 'angular-scroll.js'
    },
    {
      name: 'angular-strap',
      version: '2.3.6',
      file: [
        'dist/angular-strap.js',
        'dist/angular-strap.tpl.js'
      ]
    },
    {
      name: 'angular-summernote',
      version: '0.8.1',
      file: 'dist/angular-summernote.js',
    },
    {
      name: 'angular-touch',
      version: '1.3.0',
      file: 'angular-touch.js'
    },
    {
      name: 'angular-translate',
      version: '2.15.1',
      file: 'dist/angular-translate.js'
    },
    {
      name: 'angular-ui-router',
      version: '0.2.18',
      file: 'release/angular-ui-router.js'
    },
    {
      name: 'angular-web-notification',
      version: '1.0.19',
      file: 'angular-web-notification.js'
    },
    {
      name: 'animate.css',
      version: '3.1.1',
      file: null,
      css: 'animate.css'
    },
    {
      name: 'arrive',
      version: '2.2.1',
      file: 'src/arrive.js'
    },
    {
      name: 'autosize',
      version: '3.0.13',
      file: 'dist/autosize.js'
    },
    {
      name: 'blueimp-canvas-to-blob',
      version: '2.1.0',
      file: 'js/canvas-to-blob.js'
    },/* do not use bootstrap from node_modules because we have to override one file on it
    {
      name: 'bootstrap',
      version: '3.3.5',
      file: 'dist/js/bootstrap.js',
      skipLinkTag: true,
      css: [
        'less/tables.less',
        'less/badges.less',
        'less/buttons.less',
        'less/input-groups.less',
        'less/glyphicons.less',
        'less/list-group.less',
        'less/jumbotron.less',
        'less/mixins.less',
        'less/panels.less',
        'less/popovers.less',
        'less/tooltip.less',
        'less/media.less',
        'less/pagination.less',
        'less/responsive-utilities.less',
        'less/dropdowns.less',
        'less/responsive-embed.less',
        'less/pager.less',
        'less/button-groups.less',
        'less/variables.less',
        'less/scaffolding.less',
        'less/progress-bars.less',
        'less/type.less',
        'less/breadcrumbs.less',
        'less/navs.less',
        'less/code.less',
        'less/forms.less',
        'less/utilities.less',
        'less/.csscomb.json',
        'less/component-animations.less',
        'less/alerts.less',
        'less/normalize.less',
        'less/grid.less',
        'less/bootstrap.less',
        'less/modals.less',
        'less/print.less',
        'less/theme.less',
        'less/close.less',
        'less/navbar.less',
        'less/thumbnails.less',
        'less/carousel.less',
        'less/labels.less',
        'less/mixins/grid-framework.less',
        'less/mixins/buttons.less',
        'less/mixins/tab-focus.less',
        'less/mixins/text-emphasis.less',
        'less/mixins/list-group.less',
        'less/mixins/text-overflow.less',
        'less/mixins/nav-vertical-align.less',
        'less/mixins/reset-text.less',
        'less/mixins/gradients.less',
        'less/mixins/hide-text.less',
        'less/mixins/border-radius.less',
        'less/mixins/panels.less',
        'less/mixins/clearfix.less',
        'less/mixins/reset-filter.less',
        'less/mixins/pagination.less',
        'less/mixins/size.less',
        'less/mixins/responsive-visibility.less',
        'less/mixins/nav-divider.less',
        'less/mixins/background-variant.less',
        'less/mixins/forms.less',
        'less/mixins/image.less',
        'less/mixins/vendor-prefixes.less',
        'less/mixins/alerts.less',
        'less/mixins/grid.less',
        'less/mixins/resize.less',
        'less/mixins/center-block.less',
        'less/mixins/table-row.less',
        'less/mixins/opacity.less',
        'less/mixins/labels.less',
        'less/mixins/progress-bar.less',
        'less/wells.less',
      ]
    },*/
    {
      name: 'bootstrap-switch',
      version: '3.3.2',
      file: 'dist/js/bootstrap-switch.js',
      css: 'dist/css/bootstrap3/bootstrap-switch.css'
    },
    {
      name: 'clipboard',
      version: '1.5.16',
      file: 'lib/clipboard.js'
    },
    {
      name: 'email-addresses',
      version: '3.0.0',
      file: 'lib/email-addresses.js',
    },
    {
      name: 'iframe-resizer',
      version: '3.5.5',
      file: 'js/iframeResizer.js',
    },
    {
      name: 'jquery',
      version: '2.1.1',
      file: 'dist/jquery.js'
    },/* do not use npm versions because we overwriet a file on it
    {
      name: 'jquery.focus',
      version: '0.1.4',
      file: 'dist/jquery.focus.js',
    },*/
    {
      name: 'leaflet',
      version: '0.7.3',
      file: 'dist/leaflet.js',
      css: 'dist/leaflet.css'
    },
    {
      name: 'localforage',
      version: '1.7.4', // updated localforag to be webpack compatible
      file: 'dist/localforage.js',
    },
    {
      name: 'lodash',
      version: '2.4.1',
      file: 'dist/lodash.js',
    },
    {
      name: 'matchmedia-ng',
      version: '1.0.8',
      file: 'matchmedia-ng.js',
    },
    {
      name: 'material-shadows',
      version: '2.0.1',
      file: null,
      css: 'material-shadows.less',
      skipLinkTag: true,
    },
    {
      name: 'mdi',
      version: '2.0.46',
      file: null,
      css: 'css/materialdesignicons.css'
    },
    {
      name: 'moment',
      version: '2.15.1',
      file: 'moment.js',
    },
    {
      name: 'ng-tags-input',
      version: '3.2.0',
      file: 'build/ng-tags-input.js',
      css: 'build/ng-tags-input.css'
    },
    {
      name: 'restangular',
      version: '1.3.1',
      file: 'dist/restangular.js',
    },
    {
      name: 'roboto-fontface',
      version: '0.4.3',
      file: null,
      css: 'css/roboto-fontface.css'
    },
    {
      name: 'showdown',
      version: '1.5.0',
      file: 'dist/showdown.js',
    },
    {
      name: 'summernote',
      version: 'linagora/summernote#0.8.2-1',
      file: [
        'dist/summernote.js',
      ], // TODO summernote i18n
      css: 'dist/summernote.css',
      isLinagora: true
    },
    {
      name: 'ui-router-extras',
      version: '0.1.0',
      file: 'release/ct-ui-router-extras.js',
    },
    {
      name: 'videogular',
      version: '1.4.4',
      file: 'videogular.js',
    },
    {
      name: 'videogular-buffering',
      version: '1.4.4',
      file: 'vg-buffering.js',
    },
    {
      name: 'videogular-controls',
      version: '1.4.4',
      file: 'vg-controls.js',
    },
    {
      name: 'videogular-overlay-play',
      version: '1.4.4',
      file: 'vg-overlay-play.js',
    },
    {
      name: 'angular-cookies',
      version: '1.3.20',
      file: 'angular-cookies.js',
    },
    {
      name: 'moment-timezone',
      version: '0.5.17',
      file: 'builds/moment-timezone-with-data.js',
    },
    {
      name: 'dompurify',
      bowerName: 'DOMPurify',
      version: '1.0.9',
      file: 'dist/purify.js',
    },
    { // dependency of matchmedia-ng
      name: 'matchmedia',
      version: '0.1.1',
      file: 'index.js'
    },
    { // dependency of ng-device-detector
      name: 're-tree',
      version: '0.0.2',
      file: 're-tree.js'
    }

  ],






  /**
   * Those are modules available on bower but not on NPM
   *
   * So for those modules we copy them from 'ESN/frontend/components'
   * into 'src/frontend/components'
   */
   BOWER_ORPHANED: [
    {
      name: 'angular-bootstrap-switch',
      file: 'dist/angular-bootstrap-switch.js',
    },
    {
      name: 'angular-clockpicker',
      version: '1.2.0',
      file: 'dist/angular-clockpicker.min.js',
      isLinagora: true
    },
    {
      name: 'angular-component',
      version: 'linagora/angular-component#0.1.4',
      file: 'src/angular-component.js',
      isLinagora: true
    },
    {
      name: 'angular-file-upload',
      version: 'danialfarid/angular-file-upload#~2.0.4',
      file: 'dist/angular-file-upload.js'
    },
    {
      name: 'angular-fullscreen',
      version: '1.0.1',
      file: 'src/angular-fullscreen.js'
    },
    {
      name: 'angular-hotkeys',
      version: 'chieffancypants/angular-hotkeys#1.7.0',
      file: 'src/hotkeys.js'
    },
    {
      name: 'angularjs-naturalsort',
      version: 'linagora/angularjs-naturalsort#1.1.4',
      file: 'dist/naturalSortVersion.js',
      isLinagora: true,
    },
    {
      name: 'angular-jstz',
      version: 'czarpino/angular-jstz',
      file: 'angular-jstz.js',
      isLinagora: true,
    },
    {
      name: 'angular-leaflet-directive',
      version: '0.7.8',
      file: 'dist/angular-leaflet-directive.js'
    },
    {
      name: 'angular-markdown-directive',
      version: 'linagora/angular-markdown-directive#0.4.1',
      file: 'markdown.js'
    },
    {
      name: 'angular-recaptcha',
      version: '0.0.7',
      file: 'release/angular-recaptcha.js'
    },
    {
      name: 'angular-recursion', // check, should only be used in community
      version: '1.0.3',
      file: 'angular-recursion.js'
    },
    {
      name: 'angular-scroll-glue',
      version: '2.0.7',
      file: 'src/scrollglue.js'
    },
    {
      name: 'angular-sticky',
      version: 'angular-sticky-plugin#0.4.1',
      file: 'js/angular-sticky.js'
    },
    {
      name: 'angular-truncate',
      version: 'sparkalow/angular-truncate',
      file: 'src/truncate.js'
    },
    {
      name: 'angular-uuid4',
      version: '0.3.0',
      file: 'angular-uuid4.js'
    },
    {
      name: 'angular-xeditable',
      version: '0.1.9',
      file: 'dist/js/xeditable.js',
      css: 'dist/css/xeditable.css'
    },
    {
      name: 'Autolinker.js',
      version: '0.24.1',
      file: 'dist/Autolinker.js'
    },
    {
      name: 'awesome-angular-swipe',
      version: 'linagora/awesome-angular-swipe#0.0.12',
      file: 'lib/awesome-angular-swipe.js',
      css: 'dist/awesome-angular-swipe.css',
      isLinagora: true
    },
    {
      name: 'bootstrap-additions',
      version: '0.2.3',
      file: null,
      css: 'dist/bootstrap-additions.css'
    },
    {
      name: 'char-api',
      version: 'linagora/char-api#0.1.1',
      file: 'lib/charAPI.js',
      isLinagora: true,
    },
    {
      name: 'Chart.js',
      version: 'nnnick/Chart.js#~1.0.1',
      file: 'Chart.js',
    },
    {
      name: 'dynamic-directive',
      version: '3.0.0',
      file: 'dist/dynamic-directive.js',
      isLinagora: true,
    },
    {
      name: 'ical.js',
      version: 'linagora/ical.js#v1.2.4',
      file: 'build/ical.js',
      isLinagora: true,
    },
    {
      name: 'jcrop',
      version: '0.9.12',
      file: 'js/jquery.Jcrop.js',
      css: 'css/jquery.Jcrop.css'
    },
    {
      name: 'material-admin',
      version: 'linagora/material-admin#1.5.1.5',
      file: 'js/modules/form.js',
      css: [
        'less/app.less',
        'less/inc/header.less',
        'less/inc/card.less',
        'less/inc/ie-warning.less',
        'less/inc/form.less',
        'less/inc/breadcrumb.less',
        'less/inc/misc.less',
        'less/inc/load.less',
        'less/inc/login.less',
        'less/inc/bootstrap-overrides.less',
        'less/inc/listview.less',
        'less/inc/chart.less',
        'less/inc/footer.less',
        'less/inc/sidebar.less',
        'less/inc/modal.less',
        'less/inc/tooltip.less',
        'less/inc/media.less',
        'less/inc/button.less',
        'less/inc/pagination.less',
        'less/inc/photos.less',
        'less/inc/font.less',
        'less/inc/variables.less',
        'less/inc/404.less',
        'less/inc/messages.less',
        'less/inc/popover.less',
        'less/inc/dropdown.less',
        'less/inc/pricing-table.less',
        'less/inc/generics.less',
        'less/inc/profile.less',
        'less/inc/wall.less',
        'less/inc/widgets.less',
        'less/inc/shadow.less',
        'less/inc/bootstrap-master/tables.less',
        'less/inc/bootstrap-master/badges.less',
        'less/inc/bootstrap-master/buttons.less',
        'less/inc/bootstrap-master/input-groups.less',
        'less/inc/bootstrap-master/glyphicons.less',
        'less/inc/bootstrap-master/list-group.less',
        'less/inc/bootstrap-master/jumbotron.less',
        'less/inc/bootstrap-master/mixins.less',
        'less/inc/bootstrap-master/panels.less',
        'less/inc/bootstrap-master/popovers.less',
        'less/inc/bootstrap-master/tooltip.less',
        'less/inc/bootstrap-master/media.less',
        'less/inc/bootstrap-master/pagination.less',
        'less/inc/bootstrap-master/responsive-utilities.less',
        'less/inc/bootstrap-master/dropdowns.less',
        'less/inc/bootstrap-master/responsive-embed.less',
        'less/inc/bootstrap-master/pager.less',
        'less/inc/bootstrap-master/button-groups.less',
        'less/inc/bootstrap-master/variables.less',
        'less/inc/bootstrap-master/scaffolding.less',
        'less/inc/bootstrap-master/progress-bars.less',
        'less/inc/bootstrap-master/type.less',
        'less/inc/bootstrap-master/breadcrumbs.less',
        'less/inc/bootstrap-master/navs.less',
        'less/inc/bootstrap-master/code.less',
        'less/inc/bootstrap-master/forms.less',
        'less/inc/bootstrap-master/utilities.less',
        'less/inc/bootstrap-master/component-animations.less',
        'less/inc/bootstrap-master/alerts.less',
        'less/inc/bootstrap-master/normalize.less',
        'less/inc/bootstrap-master/grid.less',
        'less/inc/bootstrap-master/bootstrap.less',
        'less/inc/bootstrap-master/modals.less',
        'less/inc/bootstrap-master/print.less',
        'less/inc/bootstrap-master/theme.less',
        'less/inc/bootstrap-master/close.less',
        'less/inc/bootstrap-master/navbar.less',
        'less/inc/bootstrap-master/thumbnails.less',
        'less/inc/bootstrap-master/carousel.less',
        'less/inc/bootstrap-master/labels.less',
        'less/inc/bootstrap-master/mixins/grid-framework.less',
        'less/inc/bootstrap-master/mixins/buttons.less',
        'less/inc/bootstrap-master/mixins/tab-focus.less',
        'less/inc/bootstrap-master/mixins/text-emphasis.less',
        'less/inc/bootstrap-master/mixins/list-group.less',
        'less/inc/bootstrap-master/mixins/text-overflow.less',
        'less/inc/bootstrap-master/mixins/nav-vertical-align.less',
        'less/inc/bootstrap-master/mixins/gradients.less',
        'less/inc/bootstrap-master/mixins/hide-text.less',
        'less/inc/bootstrap-master/mixins/border-radius.less',
        'less/inc/bootstrap-master/mixins/panels.less',
        'less/inc/bootstrap-master/mixins/clearfix.less',
        'less/inc/bootstrap-master/mixins/reset-filter.less',
        'less/inc/bootstrap-master/mixins/pagination.less',
        'less/inc/bootstrap-master/mixins/size.less',
        'less/inc/bootstrap-master/mixins/responsive-visibility.less',
        'less/inc/bootstrap-master/mixins/nav-divider.less',
        'less/inc/bootstrap-master/mixins/background-variant.less',
        'less/inc/bootstrap-master/mixins/forms.less',
        'less/inc/bootstrap-master/mixins/image.less',
        'less/inc/bootstrap-master/mixins/vendor-prefixes.less',
        'less/inc/bootstrap-master/mixins/alerts.less',
        'less/inc/bootstrap-master/mixins/grid.less',
        'less/inc/bootstrap-master/mixins/resize.less',
        'less/inc/bootstrap-master/mixins/center-block.less',
        'less/inc/bootstrap-master/mixins/table-row.less',
        'less/inc/bootstrap-master/mixins/opacity.less',
        'less/inc/bootstrap-master/mixins/labels.less',
        'less/inc/bootstrap-master/mixins/progress-bar.less',
        'less/inc/bootstrap-master/wells.less',
        'less/inc/chat.less',
        'less/inc/contacts.less',
        'less/inc/form/form.less',
        'less/inc/wizard.less',
        'less/inc/less-plugins/for.less',
        'less/inc/panel.less',
        'less/inc/print.less',
        'less/inc/table.less',
        'less/inc/base.less',
        'less/inc/mixin.less',
        'less/inc/invoice.less',
        'less/inc/todo.less',
        'less/inc/tabs.less',
        'less/inc/progress-bar.less',
        'less/inc/alert.less',
        'less/inc/vendor-overrides/bootstrap-select.less',
        'less/inc/vendor-overrides/light-gallery.less',
        'less/inc/vendor-overrides/bootgrid.less',
        'less/inc/vendor-overrides/summernote.less',
        'less/inc/vendor-overrides/farbtastic.less',
        'less/inc/vendor-overrides/sweetalert.less',
        'less/inc/vendor-overrides/mediaelement.less',
        'less/inc/vendor-overrides/fileinput.less',
        'less/inc/vendor-overrides/noUiSlider.less',
        'less/inc/vendor-overrides/waves.less',
        'less/inc/vendor-overrides/ng-table.less',
        'less/inc/vendor-overrides/bootstrap-chosen.less',
        'less/inc/vendor-overrides/bootstrap-datetimepicker.less',
        'less/inc/vendor-overrides/fullcalendar.less',
        'less/inc/vendor-overrides/ui-bootstrap.less',
      ],
      skipLinkTag: true,
      isLinagora: true
    },
    {
      name: 'ngclipboard',
      version: '1.1.3',
      file: 'dist/ngclipboard.js',
    },
    {
      name: 'ng-device-detector',
      version: 'linagora/ng-device-detector#v3.0.1.1',
      file: 'ng-device-detector.js',
      isLinagora: true
    },
    {
      name: 'ngGeolocation',
      version: '0.0.4',
      file: 'ngGeolocation.js',
    },
    {
      name: 'ngInfiniteScroll',
      version: 'linagora/ngInfiniteScroll#1.3.0-1',
      file: 'build/ngInfiniteScroll.js',
      isLinagora: true
    },
    {
      name: 'offline',
      version: '0.7.14',
      file: 'offline.js',
    },
    {
      name: 'openpaas-logo',
      version: '0.8.0',
      file: 'openpaas-logo.js',
      isLinagora: true
    },
    {
      name: 'remarkable-bootstrap-notify',
      version: '3.1.3',
      file: 'bootstrap-notify.js',
    },
    {
      name: 'twitter-platform-widget',
      version: 'http://platform.twitter.com/widgets.js',
      file: 'widgets.js'
    },
    {
      name: 'waves',
      version: '0.7.5',
      file: 'dist/waves.js',
      css: 'src/less/waves.less',
      skipLinkTag: true
    },
    {
      name: 'angular-colorpicker-directive',
      version: '1.2.2',
      file: 'js/color-picker.js',
      css: 'css/color-picker.css'
    },
    { // this is a dependency of angular-clockpicker
      name: 'lng-clockpicker',
      version: '0.0.9',
      file: 'dist/bootstrap-clockpicker.js',
      css: 'dist/bootstrap-clockpicker.css',
      isLinagora: true
    },
    {
      name: 'html5-desktop-notifications2',
      version: '3.0.1',
      file: 'dist/Notification.js'
    },
    { // dependency of angular-jstz
      name: 'jstzdetect',
      version: '1.0.6',
      file: 'jstz.js'
    },
    {
      name: 'bootstrap',
      version: '3.3.5',
      file: 'dist/js/bootstrap.js',
      skipLinkTag: true,
      css: [
        'less/tables.less',
        'less/badges.less',
        'less/buttons.less',
        'less/input-groups.less',
        'less/glyphicons.less',
        'less/list-group.less',
        'less/jumbotron.less',
        'less/mixins.less',
        'less/panels.less',
        'less/popovers.less',
        'less/tooltip.less',
        'less/media.less',
        'less/pagination.less',
        'less/responsive-utilities.less',
        'less/dropdowns.less',
        'less/responsive-embed.less',
        'less/pager.less',
        'less/button-groups.less',
        'less/variables.less',
        'less/scaffolding.less',
        'less/progress-bars.less',
        'less/type.less',
        'less/breadcrumbs.less',
        'less/navs.less',
        'less/code.less',
        'less/forms.less',
        'less/utilities.less',
        'less/.csscomb.json',
        'less/component-animations.less',
        'less/alerts.less',
        'less/normalize.less',
        'less/grid.less',
        'less/bootstrap.less',
        'less/modals.less',
        'less/print.less',
        'less/theme.less',
        'less/close.less',
        'less/navbar.less',
        'less/thumbnails.less',
        'less/carousel.less',
        'less/labels.less',
        'less/mixins/grid-framework.less',
        'less/mixins/buttons.less',
        'less/mixins/tab-focus.less',
        'less/mixins/text-emphasis.less',
        'less/mixins/list-group.less',
        'less/mixins/text-overflow.less',
        'less/mixins/nav-vertical-align.less',
        'less/mixins/reset-text.less',
        'less/mixins/gradients.less',
        'less/mixins/hide-text.less',
        'less/mixins/border-radius.less',
        'less/mixins/panels.less',
        'less/mixins/clearfix.less',
        'less/mixins/reset-filter.less',
        'less/mixins/pagination.less',
        'less/mixins/size.less',
        'less/mixins/responsive-visibility.less',
        'less/mixins/nav-divider.less',
        'less/mixins/background-variant.less',
        'less/mixins/forms.less',
        'less/mixins/image.less',
        'less/mixins/vendor-prefixes.less',
        'less/mixins/alerts.less',
        'less/mixins/grid.less',
        'less/mixins/resize.less',
        'less/mixins/center-block.less',
        'less/mixins/table-row.less',
        'less/mixins/opacity.less',
        'less/mixins/labels.less',
        'less/mixins/progress-bar.less',
        'less/wells.less',
      ]
    },
    {
      name: 'angular-localforage',
      version: '1.2.2',
      file: 'dist/angular-localForage.js'
    },
    {
      name: 'jquery.focus',
      version: '0.1.4',
      file: 'dist/jquery.focus.js',
    },
  ]
};

const path = require('path');
const { accessSync } = require('fs');
const { R_OK } = require('fs').constants;
const glob = require('glob-all');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// default: we are building an SPA
let angularCommon = path.resolve(__dirname, 'node_modules', 'esn-frontend-common-libs', 'src', 'angular-common.js');
const angularInjections = path.resolve(__dirname, 'src', 'angular-injections.js');
let chartJs = path.resolve(__dirname, 'node_modules', 'esn-frontend-common-libs', 'src', 'frontend', 'components', 'Chart.js/Chart.js')
let materialAdmin = path.resolve(__dirname, 'node_modules', 'esn-frontend-common-libs', 'src', 'frontend', 'js', 'material.js')

try {
  accessSync(path.resolve(__dirname, 'node_modules', 'esn-frontend-common-libs', 'src', 'angular-common.js'));
} catch (e) {
  // fallback: we are building the esn-frontend-common-libs
  angularCommon = path.resolve(__dirname, 'src', 'angular-common');
  chartJs = path.resolve(__dirname, 'src', 'frontend', 'components', 'Chart.js/Chart.js');
  materialAdmin = path.resolve(__dirname, 'src', 'frontend', 'js', 'material.js');

}

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: "source-map",
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.IgnorePlugin({ resourceRegExp: /codemirror/ }), // for summernote
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
      'Chart': chartJs,
      materialAdmin: materialAdmin,
      angular: angularCommon,
      'window.angularInjections': angularInjections,
      angularDragula: 'angularjs-dragula/angularjs-dragula.js', // for unifiedinbox
      sanitizeHtml: 'sanitize-html', // for unifiedinbox
      DOMPurify: 'dompurify'
    }),
    new HtmlWebpackPlugin({
      template: './assets/index.pug',
      filename: './index.html'
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9900,
    proxy: [{
      context: [
        '/auth',
        '/api',
        '/views',
        '/profile/app',
        '/controlcenter/app',
        '/images',
        '/socket.io/',
        '/user-status/app/bubble/',
        '/user-status/api',
        '/contact/app',
        '/dav/api',
        '/unifiedinbox/views',
        '/unifiedinbox/app',
        '/unifiedinbox/api',
      ],
      //target: 'http://localhost:8080',
      target: 'https://dev.open-paas.org',
      disableHostCheck: true,
      secure: false,
      changeOrigin: true,

    }]
  },
  module: {
    rules: [
      /*
      for linagora.esn.unifiedinbox

      can be removed after using a require for jmapDraft instead of a global $window.jmapDraft

        .factory('jmapDraft', function($window) {
          return $window.jmapDraft;
        })

      */
      {
        test: require.resolve('jmap-draft-client/dist/jmap-draft-client.js'),
        loader: 'expose-loader',
        options: {
          exposes: 'jmapDraft',
        },
      },
      /*
      for esn-frontend-common-libs

      can be removed after using a require for emailAddresses instead of a global $window.emailAddresses

        angular.module('esn.email-addresses-wrapper', [])

        .factory('emailAddresses', function($window) {
          return $window.emailAddresses;
        });

      */
      {
        test: require.resolve('email-addresses'),
        loader: 'expose-loader',
        options: {
          exposes: 'emailAddresses',
        },
      },
      /*
      for esn-frontend-common-libs

      can be removed after using a require for autosize instead of a global $window.autosize

      angular.module('esn.form.helper')
        .factory('autosize', function($window) {
            return $window.autosize;
          })

      */
      {
        test: require.resolve('autosize'),
        loader: 'expose-loader',
        options: {
          exposes: 'autosize',
        },
      },
      /*
      for esn-frontend-common-libs

      can be removed after using a require for Autolinker instead of a global $window.Autolinker

      angular.module('esn.autolinker-wrapper', [])

        .factory('autolinker', function($window) {
          return $window.Autolinker;
        });

      */
      {
        test: require.resolve('esn-frontend-common-libs/src/frontend/components/Autolinker.js/dist/Autolinker.js'),
        loader: 'expose-loader',
        options: {
          exposes: 'Autolinker',
        },
      },
      /*
        usefull, at least for esn-frontend-common-libs / notification.js:

        var notification = $window.$.notify(escapeHtmlFlatObject(options), angular.extend({}, getDefaultSettings(options), settings));

      */
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: '$',
        },
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /all\.less$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
    ],
  },
}

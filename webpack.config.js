const path = require('path');
const { accessSync } = require('fs');
const { R_OK } = require('fs').constants;
const glob = require('glob-all');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// default: we are building an SPA
let angularCommon = path.resolve(__dirname, 'node_modules', 'esn-frontend-common-libs', 'src', 'anguar-common.js');
let angularInjections = path.resolve(__dirname, 'node_modules', 'esn-frontend-common-libs', 'src', 'anguar-injections.js');

try {
  accessSync(path.resolve(__dirname, 'node_modules', 'esn-frontend-common-libs', 'src', 'anguar-common.js'));
} catch (e) {
  // fallback: we are building the esn-frontend-common-libs
  angularCommon = path.resolve(__dirname, 'src', 'angular-common');
  angularInjections = path.resolve(__dirname, 'src', 'angular-injections.js');
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
      'Chart': path.resolve(__dirname, 'src', 'frontend', 'components', 'Chart.js/Chart.js'),
      materialAdmin: path.resolve(__dirname, 'src', 'frontend', 'js', 'material.js'),
      angular: angularCommon,
      'window.angularInjections': angularInjections,
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
      context: ['/auth', '/api', '/views', '/profile/app', '/controlcenter/app', '/images', '/socket.io/', '/user-status/app/bubble/'],
      target: 'http://localhost:8080',
    }]
  },
  module: {

    rules: [
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

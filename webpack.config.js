const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack');


module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: "source-map",
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist', 'js'),
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
      angular: path.resolve(__dirname, 'src', 'angular-common'),
      'window.angularInjections': path.resolve(__dirname, 'src', 'angular-injections.js'),
    })
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

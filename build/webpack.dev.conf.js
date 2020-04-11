'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const portfinder = require('portfinder');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const iportalUrl = 'http://localhost:8190/iportal';

const devWebpackConfig = merge(baseWebpackConfig, {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{ from: /^\/$/, to: '/md/index.html' }]
    },
    hot: true,
    contentBase: false,
    compress: true,
    host: HOST || 'localhost',
    port: PORT || 8080,
    proxy: [{
      context: ['/md', '/web', '/iportal', '/apps'],
      target: iportalUrl,
      changeOrigin: true,
      pathRewrite: { '^/md': '/apps/mapdashboard/v2', '^/iportal': '' },
      onProxyRes: function(proxyRes, req, res) {
        var cookies = proxyRes.headers['set-cookie'];
        var cookieRegex = /Path=\/iportal;/i; // 返回的cookie中提取 Path
        //修改cookie Path
        if (cookies) {
          var newCookie = cookies.map(function(cookie) {
            if (cookieRegex.test(cookie)) {
              return cookie.replace(cookieRegex, '');
            }
            return cookie;
          });
          delete proxyRes.headers['set-cookie'];
          proxyRes.headers['set-cookie'] = newCookie;
        }
      }
    }],
    overlay: { warnings: false, errors: true },
    open: true,
    openPage: 'md/index.html',
    publicPath: '/',
    quiet: true,
    watchOptions: {
      poll: false
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../src/components.json'),
        to: 'static',
        ignore: ['.*']
      }
    ])
  ]
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || 8080;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      process.env.PORT = port;
      devWebpackConfig.devServer.port = port;

      devWebpackConfig.devServer.proxy.push({
        context: ['/resources/mapDashboard/customComponents'],
        target: `http://${devWebpackConfig.devServer.host}:${port}`,
        pathRewrite: { '^/resources/mapDashboard/customComponents': '/static' }
      })

      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}/md/index.html`
            ]
          },
          onErrors: utils.createNotifierCallback()
        })
      );

      resolve(devWebpackConfig);
    }
  });
});

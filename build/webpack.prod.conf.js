const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/components.json'),
        to: 'components.json',
        ignore: ['.*']
      }
    ]),
    // 压缩JS
    new UglifyJsPlugin({
      sourceMap: true,
      uglifyOptions: {
        compress: false
      }
    }),
    // 压缩CSS 注意不做提取
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ]
});

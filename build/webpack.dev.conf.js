var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var pages = Object.keys(utils.getEntries(['src/views/**/*.pug', '!src/views/**/_*.pug'], 'src/views/'))

baseWebpackConfig.plugins = []

pages.forEach(function (pathname) {
  var options = {
    filename: pathname + '.html',
    template: 'src/views/' + pathname + '.pug',
    inject: false
  }

  // 在 entry 中有定义才插入到页面中
  if (pathname in baseWebpackConfig.entry) {
    options.favicon = 'src/images/favicon.ico'
    options.inject = 'body'
    options.chunks = ['manifest', 'vendors', pathname]
    options.hash = true
  }

  baseWebpackConfig.plugins.push(new HtmlWebpackPlugin(options))
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
})

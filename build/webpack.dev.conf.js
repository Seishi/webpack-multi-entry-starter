'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReloadPlugin = require('reload-html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

// add hot-reload related code to entry chunks
// Object.keys(baseWebpackConfig.entry).forEach(function (name) {
//   baseWebpackConfig.entry[name] = ['webpack/hot/dev-server'].concat(baseWebpackConfig.entry[name])
// })

baseWebpackConfig.module.rules.push({
  test: /\.pug$/,
  loader: 'template-html-loader',
  options: {
    resolveUrl (url = '') {
      return '/' + url
    }
  }
})

var pages = Object.keys(utils.getEntries(['src/pages/**/*.pug', '!src/pages/**/_*.pug'], 'src/pages/'))

baseWebpackConfig.plugins = [
  new ReloadPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
  new webpack.NoEmitOnErrorsPlugin()
  // https://github.com/ampedandwired/html-webpack-plugin
]

pages.forEach(function (pathname) {
  var options = {
    filename: pathname + '.html',
    template: 'src/pages/' + pathname + '.pug',
    inject: true
  }

  var chunks = utils.getChunks(pathname)
  
  options.chunks = chunks
  options.hash = true
  options.alwaysWriteToDisk = true
  options.chunksSortMode = function (chunk1, chunk2) {
    var order1 = chunks.indexOf(chunk1.names[0])
    var order2 = chunks.indexOf(chunk2.names[0])
    return order1 - order2
  }

  baseWebpackConfig.plugins.push(new HtmlWebpackPlugin(options))
})

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: process.env.HOST || config.dev.host,
    port: process.env.PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    }
  }
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      devWebpackConfig.plugins.push(new webpack.DefinePlugin({
        'process.env': config.dev.env
      }))

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${config.dev.host}:${port}`]
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})

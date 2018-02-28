var path = require('path')
var utils = require('./utils')
var config = require('../config')
var merge = require('webpack-merge')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var entries = utils.getEntries(['src/scripts/pages/**/*.js'], 'src/scripts/pages/')

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: merge(entries, {
    // vendor: ['jquery', './src/scripts/common.js']
    vendor: ['./src/scripts/common.js']
  }),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src')
    },
  },
  externals: {
    jquery: "jQuery"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      // {
      //   test: /\.pug$/,
      //   loader: 'template-html-loader',
      //   options: {
      //     publicPath: '/'
      //   }
      // },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('images/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}

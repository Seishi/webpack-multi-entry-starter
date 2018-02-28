'use strict'
const execSync = require('child_process').execSync
const inquirer = require('inquirer')
const async = require('async')

// 设置相对路径
let assetsPublicPath = {
  type: 'input',
  name: 'assetsPublicPath',
  message: '设置相对路径，如 /test/ ',
  default: '/'
}

let retAnswers = {}

module.exports = new Promise(function (resolve, reject) {
  // 检查是否有git
  try {
    execSync('git status')
  } catch (error) {
    resolve(retAnswers)
    return
  }

  async.waterfall([
    // 设置相对路径
    function (cb) {
      inquirer.prompt([assetsPublicPath]).then(function (answers) {
        retAnswers.assetsPublicPath = answers.assetsPublicPath
        cb(null)
      })
    },
    // 打包
    function (cb) {
      resolve(retAnswers)
      cb(null, '')
    }
  ],
  function (err, results) {
    if (err) {
      reject(err)
    }
  })
})

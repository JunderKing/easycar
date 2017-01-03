const inquirer = require('inquirer')
const register = require('./register.js')
const login = require('./login.js')
const pasnger = require('./pasnger.js')
const driver = require('./driver.js')
const server = require('./server/server.js')

var prompt = inquirer.createPromptModule()
var regOrLog = function () {
  prompt([{
    type: 'list',
    name: 'regOrLog',
    message: '请选择：',
    choices: ['登录', '注册', '退出']
  }]).then(function (answers) {
    if (answers.regOrLog === '退出') {
      return
    }
    if (answers.regOrLog === '注册') {
      register.invoke()
    }
    if (answers.regOrLog === '登录') {
      login.invoke()
    }
  })
}

var checkOrCall = function (userId) {
  prompt([{
    type: 'list',
    name: 'checkOrCall',
    message: '请选择',
    choices: ['查看打车记录', '现在用车', '退出登录']
  }]).then(function (answers) {
    if (answers.checkOrCall === '查看打车记录') {
      return pasnger.check(userId)
    }
    if (answers.checkOrCall === '现在用车') {
      return pasnger.callCar(userId)
    }
    if (answers.checkOrCall === '退出登录') {
      return regOrLog()
    }
  })
}

var checkOrInput = function (userId) {
  prompt([{
    type: 'list',
    name: 'checkOrInput',
    message: '请选择',
    choices: ['添加车子', '输入新地址', '查看我的信息', '退出登录']
  }]).then(function (answers) {
    if (answers.checkOrInput === '添加车子') {
      driver.carAdd(userId)
    }
    if (answers.checkOrInput === '查看我的信息') {
      driver.check(userId)
    }
    if (answers.checkOrInput === '输入新地址') {
      driver.destAdd(userId)
    }
    if (answers.checkOrInput === '退出登录') {
      regOrLog(userId)
    }
  })
}

regOrLog()
server.start()

exports.regOrLog = regOrLog
exports.checkOrInput = checkOrInput
exports.checkOrCall = checkOrCall

const inquirer = require('inquirer')
const register = require('./register.js')
const login = require('./login.js')
const pasnger = require('./pasnger.js')
const driver = require('./driver.js')

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
      var result = register.invoke()
      if (result) {
        answers.regOrLog = '登录'
      } else {
        regOrLog()
      }
    }
    if (answers.regOrLog === '登录') {
      var user = login.invoke()
      if (user) {
        if (user.role === 'Driver') {
          checkOrInput(user.userId)
        } else if (user.role === 'Passenger') {
          checkOrCall(user.userId)
        }
      } else {
        regOrLog()
      }
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
      pasnger.check(userId)
      checkOrCall(userId)
      return
    }
    if (answers.checkOrCall === '现在用车') {
      pasnger.callCar(userId)
      checkOrCall(userId)
    }
    if (answers.checkOrCall === '退出登录') {
      regOrLog()
    }
  })
}

var checkOrInput = function (userId) {
  prompt([{
    type: 'list',
    name: 'checkOrInput',
    message: '请选择',
    choices: ['添加车子', '输入新地址', '查看我的信息']
  }]).then(function (answers) {
    if (answers.checkOrInput === '添加车子') {
      driver.addCar(userId)
      driver.check(userId)
    }
    if (answers.checkOrInput === '查看我的信息') {
      driver.check(userId)
    }
    if (answers.checkOrInput === '输入新地址') {
      driver.input(userId)
      driver.check(userId)
    }
    checkOrInput(userId)
  })
}
console.log('欢迎使用EasyCar！')
regOrLog()

const index = require('./index.js')
const readline = require('readline-sync')
const md5 = require('crypto-js/md5')
const mysql = require('./mysql.js')
const Q = require('q')

// 手机号验证
var invoke = function () {
  var answer = readline.question('请输入手机号（输入quit退出登录）：\n')
  if (answer === 'quit') {
    return index.regOrLog()
  }
  if (!(/^1[3|4|5|7|8]\d{9}$/.test(answer))) {
    console.log('手机号输入错误!')
    return invoke()
  }
  Q.all([mysql.find('users', "tel='" + answer + "'", null)]).then(function (results) {
    if (results[0][0].length > 0) {
      return passwdVerify(results[0][0][0])
    }
    console.log('此用户未注册！')
    invoke()
  })
}
// 密码验证
var passwdVerify = function (userInfo) {
  var answer = readline.question('请输入密码（输入quit返回）：\n', {hideEchoBack: true})
  if (answer === 'quit') {
    return invoke()
  }
  var answerStr = answer + '#' + userInfo.salt
  var answerCode = md5(answerStr).toString()
  if (answerCode === userInfo.cipher) {
    console.log('登录成功，欢迎使用EasyCar！')
    console.log('用户ID：' + userInfo.id + '；角色：' + userInfo.role)
    if (userInfo.role === 0) {
      return index.checkOrCall(userInfo.id)
    }
    if (userInfo.role === 1) {
      return index.checkOrInput(userInfo.id)
    }
  }
  console.log('密码输入错误！')
  passwdVerify(userInfo)
}

exports.invoke = invoke

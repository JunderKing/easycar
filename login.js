const readline = require('readline-sync')
const fs = require('fs')
const md5 = require('crypto-js/md5')

var invoke = function () {
  var userInfo = phoneNumVerify()
  if (!userInfo) {
    return false
  }
  var pwdCorrect = passwdVerify(userInfo)
  if (!pwdCorrect) {
    return false
  }
  var infoArr = userInfo.split('###')
  var user = {
    userId: infoArr[0],
    role: infoArr[1]
  }
  return user
}
// 手机号验证
var phoneNumVerify = function () {
  do {
    var phoneNum = readline.question('请输入手机号（输入quit退出登录）：\n')
    if (phoneNum === 'quit') {
      return false
    }
    if (!(/^1[3|4|5|7|8]\d{9}$/.test(phoneNum))) {
      console.log('手机号输入错误!')
      continue
    }
    var infoData = fs.readFileSync('./database/users.txt', 'utf-8').split('\n')
    for (var i = 0; i < infoData.length; i++) {
      if (infoData[i].split('###')[0] === phoneNum) {
        return infoData[i]
      }
    }
    console.log('此用户未注册！')
  } while (true)
}
// 密码验证
var passwdVerify = function (userInfo) {
  var infoStr = userInfo.split('###')
  var passcode = infoStr[2]
  var salt = infoStr[3]
  do {
    var answer = readline.question('请输入密码（输入quit返回）：\n', {hideEchoBack: true})
    if (answer === 'quit') {
      return false
    }
    var answerStr = answer + '#' + salt
    var answerCode = md5(answerStr).toString()
    if (answerCode === passcode) {
      return true
    }
    console.log('密码输入错误！')
  } while (true)
}

exports.invoke = invoke

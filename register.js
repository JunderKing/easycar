const readline = require('readline-sync')
const fs = require('fs')
const md5 = require('crypto-js/md5')
const mysql = require('./mysql.js')

var invoke = function () {
  var phoneNum = phoneNumInput()
  if (!phoneNum) {
    return false
  }
  var passwd = passwdInput()
  if (!passwd) {
    return false
  }
  var role = roleChoose()
  if (!role) {
    return false
  }
  infoSave(phoneNum, passwd, role)
  return true
}
// 手机号录入
var phoneNumInput = function () {
  do {
    var answer = readline.question('请输入您的手机号（输入quit退出注册）:\n')
    if (answer === 'quit') {
      return false
    }
    if (!(/^1[3|4|5|7|8]\d{9}$/.test(answer))) {
      console.log('Phone number is not correct!')
      continue
    }
    var infoData = fs.readFileSync('./database/users.txt', 'utf-8').split('\n')
    var isExist = false
    for (var i = 0; i < infoData.length; i++) {
      if (infoData[i].split('###')[0] === answer) {
        isExist = true
        break
      }
    }
    if (isExist) {
      console.log('此用户已注册！')
    } else {
      return answer
    }
  } while (true)
}
// 密码录入
var passwdInput = function () {
  do {
    var answer = readline.question('请输入密码:\n', {hideEchoBack: true})
    if (answer.length <= 6) {
      console.log('请至少输入6位以上密码!')
      continue
    }
    var repeat = readline.question('请再次输入密码:\n', {hideEchoBack: true})
    if (answer === repeat) {
      return answer
    } else {
      console.log('两次输入的密码不一致，请重新输入！')
    }
  } while (true)
}
// 角色选择
var roleChoose = function () {
  var items = ['Driver', 'Passenger']
  var index = readline.keyInSelect(items, '请选择身份：')
  console.log('index:' + index + '\nitems:' + items[index])
  return items[index]
}
// 信息保存
var infoSave = function (phoneNum, passwd, role) {
  var salt = Math.floor(Math.random() * 90000000) + 10000000 + ''
  var passwdStr = passwd + '#' + salt
  var passcode = md5(passwdStr).toString()
  var date = new Date()
  var timeStr = date.toTimeString().substring(0, 8)
  var dateStr = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '-' + timeStr
  var os = require('os')
  var IPv4 = null
  for (var i = 0; i < os.networkInterfaces().en0.length; i++) {
    if (os.networkInterfaces().en0[i].family === 'IPv4') {
      IPv4 = os.networkInterfaces().en0[i].address
    }
  }
  var infoStr = phoneNum + '###' + role + '###' + passcode + '###' + salt + '###' + IPv4 + '###' + dateStr
  fs.appendFileSync('./database/users.txt', infoStr + '\n')
}
exports.invoke = invoke

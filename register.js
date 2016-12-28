const readline = require('readline-sync')
const md5 = require('crypto-js/md5')
const mysql = require('./mysql.js')
const index = require('./index.js')
const login = require('./login.js')
const Q = require('q')

// 手机号录入
var invoke = function () {
  var answer = readline.question('请输入您的手机号（输入quit退出注册）:\n')
  if (answer === 'quit') {
    return index.regOrLog()
  }
  if (!(/^1[3|4|5|7|8]\d{9}$/.test(answer))) {
    console.log('手机号输入有误!')
    return invoke()
  }
  Q.all([mysql.find('users', "tel='" + answer + "'", null)]).then(function (results) {
    if (results[0][0].length > 0) {
      console.log('此用户已经注册！')
      return invoke()
    }
    var passwd = passwdInput()
    var role = roleChoose()
    infoSave(answer, passwd, role)
  })
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
  var items = ['Passenger', 'Driver']
  var index = readline.keyInSelect(items, '请选择身份：')
  console.log('index:' + index + '\nitems:' + items[index])
  console.log(typeof (index))
  return index
}
// 信息保存
var infoSave = function (phoneNum, passwd, role) {
  console.log(phoneNum)
  var salt = Math.floor(Math.random() * 90000000) + 10000000 + ''
  var passwdStr = passwd + '#' + salt
  var passcode = md5(passwdStr).toString()
  var os = require('os')
  var IPv4 = null
  for (var i = 0; i < os.networkInterfaces().en0.length; i++) {
    if (os.networkInterfaces().en0[i].family === 'IPv4') {
      IPv4 = os.networkInterfaces().en0[i].address
    }
  }
  var condition = 'id=(select max(id) from users)'
  Q.all([mysql.find('users', condition, 'id')]).then(function (results) {
    var maxid = 0
    if (results[0][0][0]) {
      maxid = results[0][0][0].id
    }
    var userInfo = {
      id: maxid + 1,
      tel: phoneNum,
      role: role,
      cipher: passcode,
      salt: salt,
      ip: IPv4
    }
    console.log(userInfo)
    Q.all([mysql.insert('users', userInfo)]).then(function (results) {
      console.log('insert:' + results[0][0])
      login.invoke()
    })
  })
}

exports.invoke = invoke

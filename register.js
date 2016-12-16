var encryption = require('crypto-js/md5')
var fs = require('fs')
var readline = require('readline')
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
var phoneNumber = null
var password = null
var regOrLog = function () {
  rl.question('输入a注册，输入b登录:\n', (answer) => {
    if (answer.toLowerCase() === 'a') {
      phoneNumInput()
    } else if (answer.toLowerCase() === 'b') {
      login()
    } else {
      regOrLog()
    }
  })
}
var phoneNumInput = function () {
  rl.question('请输入手机号码(输入back返回上一级)：\n', (answer) => {
    if (answer === 'back') {
      regOrLog()
      return
    }
    if (!(/^1[3|4|5|7|8]\d{9}$/.test(answer))) {
      console.log('手机号码输入有误！')
      phoneNumInput()
      return
    }
    var infoData = fs.readFileSync('users.txt', 'utf-8').split('\n')
    var isExist = false
    for (var i = 0, len = infoData.length; i < len; i++) {
      if (infoData[i].split('-')[2] === answer) {
        isExist = true
        break
      }
    }
    if (isExist) {
      console.log('此用户已注册！')
      phoneNumInput()
      return
    }
    phoneNumber = answer
    passwdInput()
  })
}
var passwdInput = function () {
  rl.question('请输入6位以上密码(输入back返回上一级):\n', (answer) => {
    if (answer === 'back') {
      phoneNumInput()
      return
    }
    if (answer.length < 7) {
      console.log('密码至少需要6位')
      passwdInput()
    } else {
      password = answer
      rl.question('请再次输入密码(输入back返回上一级)：\n', (answer) => {
        if (password !== answer) {
          console.log('两次输入不一致,请重新输入!')
          passwdInput()
        } else {
          register(phoneNumber, password)
          login()
        }
      })
    }
  })
}
var register = function (phoneNumber, password) {
  var salt = Math.floor(Math.random() * 90000000) + 10000000 + ''
  var passwdStr = password + '#' + salt
  var passcode = encryption(passwdStr).toString()
  var date = new Date()
  var timeStr = date.toTimeString().substring(0, 8)
  var dateStr = date.getFullYear() + '年' + date.getMonth() + '月' + date.getDate() + '日 ' + timeStr
  var os = require('os')
  var IPv4 = null
  for (var i = 0; i < os.networkInterfaces().en0.length; i++) {
    if (os.networkInterfaces().en0[i].family === 'IPv4') {
      IPv4 = os.networkInterfaces().en0[i].address
    }
  }
  var infoStr = dateStr + '-' + IPv4 + '-' + phoneNumber + '-' + passcode + '-' + salt
  fs.appendFileSync('users.txt', infoStr + '\n')
  console.log('注册成功！')
}
var login = function () {
  rl.question('请登录！\n请输入手机号:\n', (answer) => {
    if (!(/^1[3|4|5|7|8]\d{9}$/.test(answer))) {
      console.log('手机号码输入有误！')
      login()
      return
    }
    var infoData = fs.readFileSync('users.txt', 'utf-8').split('\n')
    var infoStr = null
    for (var i = 0, len = infoData.length; i < len; i++) {
      if (infoData[i].split('-')[2] === answer) {
        infoStr = infoData[i]
        break
      }
    }
    if (infoStr) {
      passwdVerify(answer, infoStr)
    } else {
      console.log('此用户为注册！')
      login()
    }
  })
}
var passwdVerify = function (phoneNumber, infoStr) {
  var infoArr = infoStr.split('-')
  rl.question('请输入密码：\n', (answer) => {
    var passwdStr = answer + '#' + infoArr[4]
    var passcode = encryption(passwdStr).toString()
    if (infoArr[3] === passcode) {
      console.log('登录成功！\n注册时间:' + infoArr[0] + '\nIP地址:' + infoArr[1] + '\n' + '手机号:' + infoArr[2])
      rl.close()
      return
    } else {
      console.log('密码输入错误!')
      passwdVerify(phoneNumber, infoStr)
    }
  })
}
regOrLog()

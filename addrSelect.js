const readline = require('readline-sync')
const mysql = require('./mysql.js')
const Q = require('q')

var invoke = function (callback) {
  var answer = readline.question('请输入地址首字母（输入back返回）：\n')
  if (answer === 'back') {
    return false
  }
  var condition = null
  if (parseInt(answer) > 0 && parseInt(answer) < 10000) {
    condition = 'addr_id' + answer
  } else if (answer.length === 1 && answer.toLowerCase().charCodeAt(0) >= 97 && answer.toLowerCase().charCodeAt(0) <= 122) {
    condition = "initial='" + answer.toUpperCase() + "'"
  } else {
    condition = "addr='" + answer + "'"
  }
  Q.all([mysql.find('addrs', condition, null)]).then(function (results) {
    var result = results[0][0]
    if (result.length === 0) {
      console.log('未查询到相关地址！')
      return invoke(callback)
    }
    var addr = null
    if (result.length === 1) {
      addr = result[0]
    } else {
      addr = addrFilter(result)
    }
    return callback(addr)
  }, function (error) {
    console.log('未查询到相关地址！' + error)
    return invoke(callback)
  })
}

var addrFilter = function (addrArr) {
  var logArr = addrArr.map(function (item) {
    var logStr = 'ID:' + item.addr_id + '；地区:' + item.district + '；地址:' + item.addr
    return logStr
  })
  console.log(logArr.join('\n'))
  var answer = readline.question('请输入地址名称、首字母或ID（输入back返回）：\n')
  if (answer === 'back') {
    return false
  }
  var addrs = addrArr.filter(function (item) {
    if (item.addr_id + '' === answer || item.district === answer || item.initial === answer || item.addr === answer) {
      return true
    }
  })
  if (addrs.length === 0) {
    console.log('未查询到相关地址!')
    return addrFilter(addrArr)
  }
  if (addrs.length === 1) {
    return addrs[0]
  }
  return addrFilter(addrs)
}

exports.invoke = invoke

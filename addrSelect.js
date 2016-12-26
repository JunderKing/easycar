const readline = require('readline-sync')
const fs = require('fs')
const mysql = require('./mysql.js')

var invoke = function () {
  mysql.find('addrs', null, null, function (error, result) {
    if (error) {
      console.log(error)
      return
    }
    var searchResult = addSearch(result)
  })
}

var addSearch = function (addArr) {
  var answer = readline.question('请输入地址名称、首字母或ID（输入back返回）：\n')
  if (answer === 'back') {
    return false
  }
  var addrs = addArr.fileter(function (item) {
    if (item.addr_id + '' === answer || item.initial === answer || item.addr === answer) {
      return true
    }
  })
  if (addrs.length === 0) {
    console.log('未查询到相关地址！')
    addSearch(addArr)
  } else if (addrs.length === 1) {
    return addrs
  } else {
    addSearch(addrs)
  }
}

exports.invoke = invoke

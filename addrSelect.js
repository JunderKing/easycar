const readline = require('readline-sync')
const fs = require('fs')

var invoke = function () {
  var content = fs.readFileSync('./database/addrs.txt', 'utf-8')
  var addArr = content.split('\r')
  var searchResult = addSearch(addArr)
  return searchResult
}

var addSearch = function (addArr) {
  var answer = readline.question('请输入地址名称、首字母或ID（输入back返回）：\n')
  if (answer === 'back') {
    return false
  }
  var adds = []
  var charCode = answer.toLowerCase().charCodeAt(0)
  if (answer.length === 1 && charCode >= 97 && charCode <= 122) {
    adds = addArr.filter(function (item) {
      if (item.split('-')[2] === answer.toUpperCase()) {
        return true
      }
    })
  } else if (parseInt(answer) > 100 && parseInt(answer) < 2007) {
    adds = addArr.filter(function (item) {
      if (item.split('-')[0] === answer) {
        return true
      }
    })
  } else {
    adds = addArr.filter(function (item) {
      if (item.split('-')[3].match(answer)) {
        return true
      }
    })
  }
  if (adds.length === 0) {
    console.log('未查询到相关地址!')
    return addSearch(addArr)
  } else if (adds.length === 1) {
    return adds[0]
  } else {
    console.log(adds.join('\n'))
    return addSearch(adds)
  }
}

exports.invoke = invoke

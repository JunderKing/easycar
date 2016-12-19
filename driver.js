// const readline = require('readline-sync')
const fs = require('fs')
const addrSelect = require('./addrSelect.js')

var check = function (userId) {
  var driverDests = fs.readFileSync('./database/driverDest.txt', 'utf-8').split('\n')
  var myDests = driverDests.filter(function (item) {
    if (item.split('###')[0] === userId) {
      return true
    }
  })
  if (myDests.length > 0) {
    console.log(myDests.join('\n'))
  } else {
    console.log('还没有设定目的地')
  }
}

var input = function (userId) {
  console.log('请输入接单地址：')
  var dest = addrSelect.invoke()
  if (!dest) {
    return false
  }
  var destStr = dest.split('-')[3]
  var result = destAppend(userId, destStr)
  if (!result) {
    console.log('此地址已存在!')
    input(userId)
  }
}

var destAppend = function (userId, dest) {
  var driverDests = fs.readFileSync('./database/driverDest.txt', 'utf-8').split('\n')
  var myDests = driverDests.filter(function (item) {
    if (item.split('###')[0] === userId) {
      return true
    }
  })
  if (myDests.length === 0) {
    var destStr = userId + '###' + dest
    fs.appendFileSync('./database/driverDest.txt', destStr + '\n')
    return true
  } else {
    var myDestArr = myDests[0].split('###')[1].split('#-#')
    var isExist = myDestArr.some(function (item) {
      if (item === dest) {
        return true
      }
    })
    if (isExist) {
      return false
    } else {
      var newDests = driverDests.map(function (item) {
        if (item.split('###')[0] === userId) {
          var destStr = item + '#-#' + dest
          return destStr
        }
        return item
      })
      fs.writeFileSync('./database/driverDest.txt', newDests.join('\n'))
      return true
    }
  }
}

exports.input = input
exports.check = check

// const readline = require('readline-sync')
const fs = require('fs')
const addrSelect = require('./addrSelect.js')
const carSelect = require('./carSelect.js')

var check = function (userId) {
  var driverDests = fs.readFileSync('./database/driverInfo.txt', 'utf-8').split('\n')
  var myDests = driverDests.filter(function (item) {
    if (item.split('###')[0] === userId) {
      return true
    }
  })
  if (myDests.length > 0) {
    var destInfo = myDests[0].split('###')[1].split('#-#').join(',')
    if (!destInfo) {
      destInfo = '还没有输入接单地址'
    }
    var carInfo = myDests[0].split('###')[2].split('#-#').join(',')
    if (!carInfo) {
      carInfo = '还没有输入汽车'
    }
    var str = '我的爱车们:\n' + carInfo + '\n我的接单地址:\n' + destInfo
    console.log(str)
  } else {
    console.log('没有详细信息!')
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
  var driverDests = fs.readFileSync('./database/driverInfo.txt', 'utf-8').split('\n')
  var myDests = driverDests.filter(function (item) {
    if (item.split('###')[0] === userId) {
      return true
    }
  })
  if (myDests.length === 0) {
    var destStr = userId + '###' + dest
    fs.appendFileSync('./database/driverInfo.txt', destStr + '\n')
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
        var itemArr = item.split('###')
        if (itemArr[0] === userId) {
          if (!itemArr[1]) {
            itemArr[1] = dest
          } else {
            itemArr[1] += '#-#' + dest
          }
          var destStr = itemArr.join('###')
          return destStr
        }
        return item
      })
      fs.writeFileSync('./database/driverInfo.txt', newDests.join('\n'))
      return true
    }
  }
}

var addCar = function (userId) {
  var car = carSelect.invoke()
  if (!car) {
    return false
  }
  var carId = car.split('###')[0]
  var drivers = fs.readFileSync('./database/driverInfo.txt', 'utf-8')
  var driverArr = drivers.split('\n')
  var myInfo = driverArr.filter(function (item) {
    var driverId = item.split('###')[0]
    if (userId === driverId) {
      return true
    }
  })
  if (myInfo.length === 0) {
    var infoStr = userId + '######' + carId
    fs.appendFileSync('./database/driverInfo.txt', infoStr)
  }
  if (myInfo.length === 1) {
    var myCars = []
    if (myInfo[0].split('###').length > 2) {
      myCars = myInfo[0].split('###')[2].split('#-#')
    }
    var isExist = myCars.some(function (item) {
      if (item === carId) {
        return true
      }
    })
    if (isExist) {
      console.log('此车已经添加，请勿重复添加')
      return addCar(userId)
    }
    var newInfo = driverArr.map(function (item) {
      if (item.split('###')[0] === userId) {
        var newStr = null
        if (myCars.length === 0) {
          newStr = item + '###' + carId
        } else {
          newStr = item + '#-#' + carId
        }
        return newStr
      }
      return item
    })
    fs.writeFileSync('./database/driverInfo.txt', newInfo.join('\n'))
    console.log('成功添加' + car)
    return true
  }
}

exports.input = input
exports.check = check
exports.addCar = addCar

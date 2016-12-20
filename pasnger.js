const readline = require('readline-sync')
const fs = require('fs')
const addrSelect = require('./addrSelect.js')
const carSelect = require('./carSelect.js')

var check = function (userId) {
  var logs = fs.readFileSync('./database/pasngerLog.txt', 'utf-8').split('\n')
  var myLogs = logs.filter(function (log) {
    if (log.split('###')[0] === userId) {
      return true
    }
  })
  if (myLogs.length > 0) {
    console.log(myLogs.join('\n'))
  } else {
    console.log('还没有乘车记录')
  }
}

var callCar = function (userId) {
  console.log('请输入起点：')
  var origin = addrSelect.invoke()
  if (!origin) {
    return false
  }
  origin = origin.split('-')[3]
  console.log('起点设定为：' + origin)
  console.log('请输入目的地：')
  var dest = addrSelect.invoke()
  if (!dest) {
    return false
  }
  dest = dest.split('-')[3]
  console.log('终点设定为：' + dest)
  var result = matchDriver(dest)
  if (!result) {
    console.log('该地址暂无司机接单!')
    callCar(userId)
    return false
  }
  var orderInfo = {
    userId: userId,
    driverId: result,
    origin: origin,
    dest: dest
  }
  var promptStr = '行程：' + origin + '=>' + dest + '\n司机手机号：' + result
  console.log(promptStr)
  start(orderInfo)
  return true
}

var matchDriver = function (endStr) {
  var destData = fs.readFileSync('./database/driverInfo.txt', 'utf-8').split('\n')
  var drivers = destData.filter(function (item) {
    if (!item) {
      return false
    }
    var destStr = item.split('###')[1]
    var destArr = destStr.split('#-#')
    return destArr.some(function (dest) {
      if (dest === endStr) {
        return true
      }
    })
  })
  // console.log('drivers:' + drivers)
  var len = drivers.length
  if (len === 0) {
    return false
  }
  var carIds = []
  drivers.forEach(function (driverInfo) {
    var carArr = driverInfo.split('###')[2].split('#-#')
    carArr.forEach(function (item) {
      var isExist = carIds.some(function (carId) {
        if (item === carId) {
          return true
        }
      })
      if (!isExist) {
        carIds.push(item)
      }
    })
  })
  if (carIds.length === 0) {
    return false
  }
  var car = carSelect.invoke(carIds)
  var carInfoArr = car.split('###')
  console.log('车子信息：' + carInfoArr[1] + ' ' + carInfoArr[2] + ' ' + carInfoArr[3] + ' ' + carInfoArr[7])
  console.log('价格：' + '起步价-' + carInfoArr[4] + '；时长价-' + carInfoArr[5] + '；里程价-' + carInfoArr[6])
  if (car) {
    var carId = car.split('###')[0]
    drivers = drivers.filter(function (driverInfo) {
      return driverInfo.split('###')[2].split('#-#').some(function (id) {
        if (id === carId) {
          return true
        }
      })
    })
  }

  len = drivers.length
  if (len === 0) {
    return false
  }
  var randomIndex = Math.floor(Math.random() * len)
  var driver = drivers[randomIndex]
  var phoneNum = driver.split('###')[0]
  return phoneNum
}

var start = function (orderInfo) {
  var answer = readline.question('y-开始计价，n-取消订单:\n')
  if (answer.toLowerCase() === 'y') {
    var date = new Date()
    var timeStr = date.toTimeString().substring(0, 8)
    var startTime = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '-' + timeStr
    console.log('开始时间：' + startTime)
    finish(orderInfo, startTime)
  } else if (answer.toLowerCase() === 'n') {
    callCar(orderInfo)
  } else {
    start(orderInfo)
  }
}

var finish = function (orderInfo, startTime) {
  readline.question('任意键结束用车')
  var date = new Date()
  var timeStr = date.toTimeString().substring(0, 8)
  var endTime = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '-' + timeStr
  console.log('结束时间：' + endTime + '\n谢谢使用EasyCar！')
  var logStr = orderInfo.userId + '###' + orderInfo.driverId + '###' + orderInfo.origin + '=>' + orderInfo.dest + '###' + startTime + '=>' + endTime
  fs.appendFileSync('./database/pasngerLog.txt', logStr + '\n')
}

exports.check = check
exports.callCar = callCar

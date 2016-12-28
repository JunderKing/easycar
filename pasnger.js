const readline = require('readline-sync')
const addrSelect = require('./addrSelect.js')
const carSelect = require('./carSelect.js')
const mysql = require('./mysql.js')
const index = require('./index.js')
const Q = require('q')
const readlineAsync = require('readline')

var check = function (userId) {
  Q.all([mysql.find('pasnger_logs', 'pasnger_id=' + userId, null)]).then(function (results) {
    var logArr = results[0][0].map(function (item) {
      var str = '司机:' + item.driver_id + '；旅程:' + item.origin_id + '=>' + item.dest_id +
        '；时间:' + item.start_time + '=>' + item.end_time + '；总花费:' + item.total_money + '元'
      return str
    })
    if (logArr.length === 0) {
      console.log('您还没有打车记录！')
    } else {
      console.log(logArr.join('\n'))
    }
    index.checkOrCall(userId)
  })
}

var callCar = function (userId) {
  console.log('请输入起点：')
  addrSelect.invoke(function (origin) {
    console.log('起点设定为：' + origin.addr)
    console.log('请输入目的地：')
    addrSelect.invoke(function (dest) {
      console.log('终点设定为：' + dest.addr)
      matchDriver(userId, origin, dest)
    })
  })
}

var matchDriver = function (userId, origin, dest) {
  var destId = dest.addr_id
  Q.all([mysql.find('driver_dests', 'dest_id=' + destId, 'uid')]).then(function (results) {
    if (results[0][0].length === 0) {
      console.log('此目的地暂时无人接单！')
      return callCar(userId)
    }
    var uidArr = results[0][0].map(function (item) {
      return item.uid
    })
    Q.all([mysql.find('driver_cars', 'uid in (' + uidArr.join(',') + ')', null)]).then(function (results) {
      var carIds = []
      var allCars = results[0][0]
      allCars.forEach(function (item) {
        if (carIds.indexOf(item.car_id) === -1) {
          carIds.push(item.car_id)
        }
      })
      Q.all([mysql.find('cars', 'id in (' + carIds.join(',') + ')', null)]).then(function (results) {
        var carInfo = null
        if (results[0][0].length === 1) {
          carInfo = results[0][0][0]
        } else {
          carInfo = carSelect.carFilter(results[0][0])
        }
        var driverList = allCars.filter(function (item) {
          if (item.car_id === carInfo.id) {
            return true
          }
        })
        var promiseArr = driverList.map(function (item) {
          return mysql.find('users', 'id=' + item.uid, null)
        })
        Q.all(promiseArr).then(function (results) {
          var driverArrs = []
          for (var i = 0; i < promiseArr.length; i++) {
            var obj = results[i][0][0]
            driverArrs.push(obj)
          }
          var avlDrivers = []
          var timerId = setInterval(function () {
            var driverInfo = driverArrs.shift()
            avlDrivers.push(driverInfo)
            var logStr = 'ID:' + driverInfo.id + '；手机号:' + driverInfo.tel + ' 抢单！'
            console.log(logStr)
          }, 2000)
          const rl = readlineAsync.createInterface({
            input: process.stdin,
            output: process.stdout
          })
          rl.question('请输入司机ID选择相应司机：\n', function (answer) {
            var result = avlDrivers.filter(function (item) {
              if (item.id + '' === answer) {
                return true
              }
            })
            if (result.length === 0) {
              console.log('未查询到相关司机！')
            } else {
              console.log('订单确认成功！')
              clearInterval(timerId)
              rl.close()
              start(userId, result[0], carInfo, origin, dest)
            }
          })
        })
      })
    })
  })
}

var start = function (userId, driverInfo, carInfo, origin, dest) {
  console.log('车子信息：' + carInfo.car_brand + carInfo.car_type)
  console.log('司机电话：' + driverInfo.tel)
  console.log('起点：' + origin.addr)
  console.log('终点：' + dest.addr)
  var answer = readline.question('y-开始计价，n-取消订单:\n')
  if (answer.toLowerCase() === 'y') {
    console.log('欢迎使用EasyCar，祝您旅途愉快！')
    var condition = 'log_id=(select max(log_id) from pasnger_logs)'
    Q.all([mysql.find('pasnger_logs', condition, 'log_id')]).then(function (results) {
      var maxId = 0
      if (results[0][0][0]) {
        maxId = results[0][0][0].log_id
      }
      var log = {
        log_id: maxId + 1,
        pasnger_id: userId,
        driver_id: driverInfo.id,
        origin_id: origin.addr_id,
        dest_id: dest.addr_id
      }
      Q.all([mysql.insert('pasnger_logs', log)]).then(function (results) {
        var time = 0
        var distance = 0
        var currentMoney = 0
        var shareTimer = setInterval(function () {
          time++
          var randomDist = Math.floor(Math.random() * 5 + 5) / 10.0
          distance += randomDist
        }, 5000)
        var pasngerTimer = setInterval(function () {
          currentMoney = carInfo.start_price + carInfo.time_price * time + carInfo.dist_price * distance.toFixed(1)
          console.log('乘客=> 实时花费：' + currentMoney + '元')
        }, 2000)
        var driverTimer = setInterval(function () {
          console.log('司机=> 时间:' + time + 'min；路程:' + distance.toFixed(1) + '公里')
        }, 3000)
        const rl = readlineAsync.createInterface({
          input: process.stdin,
          output: process.stdout
        })
        rl.question('输入任意字符结算：\n', function () {
          clearInterval(shareTimer)
          clearInterval(driverTimer)
          clearInterval(pasngerTimer)
          console.log('请结算：')
          console.log('行程：' + origin.addr + '=>' + dest.addr)
          console.log('总用时：' + time + '分钟')
          console.log('总距离：' + distance.toFixed(1) + '公里')
          console.log('总花费：' + currentMoney + '元')
          console.log('谢谢使用EasyCar，祝您生活愉快！')
          finish(userId, log.log_id, carInfo, time, distance, currentMoney)
          rl.close()
        })
      })
    })
  } else if (answer.toLowerCase() === 'n') {
    callCar(userId)
  } else {
    start(userId, driverInfo, carInfo, origin, dest)
  }
}

var finish = function (userId, logId, carInfo, time, distance, totalMoney) {
  var keyValue = {
    total_money: totalMoney,
    dist_money: distance * carInfo.dist_price,
    time_money: time * carInfo.time_price
  }
  Q.all([mysql.update('pasnger_logs', 'log_id=' + logId, keyValue)]).then(function (results) {
    index.checkOrCall(userId)
  })
}

exports.check = check
exports.callCar = callCar

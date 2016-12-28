const addrSelect = require('./addrSelect.js')
const carSelect = require('./carSelect.js')
const Q = require('q')
const index = require('./index.js')
const mysql = require('./mysql.js')

var check = function (userId) {
  Q.all([mysql.find('driver_cars', 'uid=' + userId, null), mysql.find('driver_dests', 'uid=' + userId, null)]).then(function (results) {
    var myCars = results[0][0].map(function (item) {
      return item.car_id
    })
    var myDests = results[1][0].map(function (item) {
      return item.dest_id
    })
    if (myCars.length === 0) {
      console.log('还没有录入我的车子！')
    } else {
      console.log('我的车子：\n' + myCars.join(','))
    }
    if (myDests.lenght === 0) {
      console.log('还没有录入接单地址！')
    } else {
      console.log('我的接单地址：\n' + myDests.join(','))
    }
    index.checkOrInput(userId)
  })
}

var destAdd = function (userId) {
  console.log('请输入接单地址：')
  addrSelect.invoke(function (addr) {
    Q.all([mysql.find('driver_dests', 'uid=' + userId, 'dest_id')]).then(function (results) {
      var myDestId = results[0][0]
      var isExist = myDestId.some(function (item) {
        if (item.dest_id === addr.addr_id) {
          return true
        }
      })
      if (isExist) {
        console.log('此地址已经录入，请勿重复录入！')
        return destAdd(userId)
      }
      var newDest = {
        uid: userId,
        dest_id: addr.addr_id
      }
      Q.all([mysql.insert('driver_dests', newDest)]).then(function (results) {
        console.log('录入成功 ！')
        console.log('新录入地址:' + newDest.dest_id)
        return index.checkOrInput(userId)
      })
    })
  })
}

var carAdd = function (userId) {
  carSelect.invoke(function (carInfo) {
    Q.all([mysql.find('driver_cars', 'uid=' + userId, null)]).then(function (results) {
      var myCars = results[0][0]
      var isExist = myCars.some(function (item) {
        if (item.car_id === carInfo.id) {
          return true
        }
      })
      if (isExist) {
        console.log('此车已经录入，请勿重复录入!')
        return carAdd(userId)
      }
      var newCar = {
        uid: userId,
        car_id: carInfo.id
      }
      Q.all([mysql.insert('driver_cars', newCar)]).then(function (results) {
        return index.checkOrInput(userId)
      })
    })
  })
}

exports.check = check
exports.destAdd = destAdd
exports.carAdd = carAdd

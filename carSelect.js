const readline = require('readline-sync')
const mysql = require('./mysql.js')
const Q = require('q')

var invoke = function (callback) {
  var answer = readline.question('请输入车子品牌：\n')
  console.log(answer)
  Q.all([mysql.find('cars', "car_brand='" + answer + "'", null)]).then(function (results) {
    var cars = results[0][0]
    if (cars.length === 0) {
      console.log('没有找到相关的车子！')
      return invoke(callback)
    }
    if (cars.lenght === 1) {
      return callback(cars[0])
    }
    var car = carFilter(cars)
    callback(car)
  })
}

var carFilter = function (carArr) {
  console.log('可供选择的车子列表：')
  carArr.forEach(function (item) {
    var logStr = 'ID:' + item.id + '；品牌:' + item.car_brand + '；车型:' + item.car_type + '；类别:' + item.category
    console.log(logStr)
  })
  var answer = readline.question('请输入ID、车牌、车型或者类别选择车子：\n')
  var cars = carArr.filter(function (item) {
    if (item.id + '' === answer || item.car_band === answer || item.car_type === answer || item.category + '' === answer) {
      return true
    }
  })
  if (cars.length === 0) {
    console.log('没有查询到相关的车子！')
    return carFilter(carArr)
  }
  if (cars.length === 1) {
    return cars[0]
  }
  return carFilter(cars)
}

exports.invoke = invoke
exports.carFilter = carFilter

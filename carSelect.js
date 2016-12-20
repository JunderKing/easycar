const readline = require('readline-sync')
const fs = require('fs')

var invoke = function (carIds) {
  var cars = fs.readFileSync('./database/carInfo.txt', 'utf-8').split('\n')
  if (carIds) {
    cars = carIds.map(function (carId) {
      return cars.filter(function (carInfo) {
        if (carInfo.split('###')[0] === carId) {
          return true
        }
      })[0]
    })
    console.log(cars.join('\n'))
  }
  return carSearch(cars)
}

var carSearch = function (carInfo) {
  var result = readline.question('请输入汽车的品牌、型号或者ID:\n')
  var newArr = carInfo.filter(function (item) {
    var itemArr = item.split('###')
    if (itemArr[0] === result || itemArr[1] === result || itemArr[2] === result || itemArr[7] === result) {
      return true
    }
  })
  if (newArr.length === 0) {
    console.log('未查询到相关车辆!')
    return carSearch(carInfo)
  }
  if (newArr.length === 1) {
    return newArr[0]
  }
  if (newArr.length >= 0) {
    console.log(newArr.join('\n'))
    return carSearch(newArr)
  }
}

exports.invoke = invoke

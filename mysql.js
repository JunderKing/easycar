const mysql = require('mysql')
// const co = require('co')
// const thunkify = require('thunkify')
// const fs = require('fs')

var db = mysql.createConnection({
  user: 'myuser',
  password: 'youxiwang',
  database: 'easycar'
})

db.connect()

// var dbquery = thunkify(db.query)
// co(function* () {
//  var result = yield dbquery('select * from addrs')
//  console.log(result)
// })

var insert = function (table, obj, callback) {
  if (!table || !obj) {
    return false
  }
  var keys = []
  var values = []
  for (var key in obj) {
    keys.push(key)
    values.push(obj[key])
  }
  var command = 'insert into ' + table + '(' + keys.join(',') + ') values(' + values.join(',') + ')'
  db.query(command, callback)
}

var find = function (table, condition, field, callback) {
  if (!field) {
    field = '*'
  }
  if (condition) {
    condition = ' where ' + condition
  } else {
    condition = ''
  }
  var command = 'select ' + field + ' from ' + table + condition
  console.log(command)
  db.query(command, callback)
}

var update = function (table, condition, obj, callback) {
  if (!condition || !obj) {
    return false
  }
  condition = ' where ' + condition
  var strArr = []
  for (var key in obj) {
    strArr.push(key + '=' + obj[key])
  }
  var command = 'update ' + table + ' set ' + strArr.join(',') + condition
  db.query(command, callback)
}

var remove = function (table, condition, callback) {
  if (!condition) {
    return false
  }
  condition = ' where ' + condition
  var command = 'delete from ' + table + condition
  db.query(command, callback)
}

// find('addrs', null, null, function (error, result) {
//  if (error) {
//    console.log(error)
//    return
//  }
// console.log(result[0].addr_id)
// })
exports.insert = insert
exports.update = update
exports.find = find
exports.remove = remove

const mysql = require('mysql')
// const fs = require('fs')

var db = mysql.createConnection({
  user: 'myuser',
  password: 'youxiwang',
  database: 'easycar'
})

db.connect()

var insert = function (table, values, callback) {
  var command = 'insert into ' + table + ' values('
  values.forEach(function (value, index) {
    if (index === values.length - 1) {
      command += "'" + value + "')"
    } else {
      command += "'" + value + "',"
    }
  })
  db.query(command, callback)
}

var find = function (table, row, query, callback) {
  if (!row) {
    row = '*'
  }
  if (query) {
    query = ' where ' + query
  }
  var command = 'select ' + row + ' from ' + table + query
  db.query(command, callback)
}

var update = function (table, content, query, callback) {
  if (query) {
    query = ' where ' + query
  }
  var command = 'update ' + table + ' set ' + content + query
  db.query(command, callback)
}

var remove = function (table, query, callback) {
  if (query) {
    query = ' where ' + query
  }
  var command = 'delete from ' + table + query
  db.query(command, callback)
}

exports.insert = insert
exports.update = update
exports.find = find
exports.remove = remove

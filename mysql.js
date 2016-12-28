const mysql = require('mysql')
const Q = require('q')

var db = mysql.createConnection({
  user: 'myuser',
  password: 'youxiwang',
  database: 'easycar'
})

db.connect(function (error, result) {
  if (error) {
    return console.log(error)
  }
//  console.log('connection ok: ' + db.threadId)
})

var insert = function (table, obj) {
  if (!table || !obj) {
    return false
  }
  var keys = []
  var values = []
  for (var key in obj) {
    keys.push(key)
    //    console.log
    if (typeof (obj[key]) === 'string') {
      obj[key] = "'" + obj[key] + "'"
    }
    values.push(obj[key])
  }
  var command = 'INSERT INTO ' + table + '(' + keys.join(',') + ') VALUES(' + values.join(',') + ')'
  //  console.log(command)
  var defered = Q.defer()
  db.query(command, defered.makeNodeResolver())
  return defered.promise
}

var find = function (table, condition, field) {
  if (!field) {
    field = '*'
  }
  if (condition) {
    condition = ' WHERE ' + condition
  } else {
    condition = ''
  }
  var command = 'SELECT ' + field + ' FROM ' + table + condition
  //  console.log(command)
  var defered = Q.defer()
  db.query(command, defered.makeNodeResolver())
  return defered.promise
}

var update = function (table, condition, obj) {
  if (!condition || !obj) {
    return false
  }
  condition = ' WHERE ' + condition
  var strArr = []
  for (var key in obj) {
    strArr.push(key + '=' + obj[key])
  }
  var command = 'UPDATE ' + table + ' SET ' + strArr.join(',') + condition
  var defered = Q.defer()
  db.query(command, defered.makeNodeResolver())
  return defered.promise
}

var remove = function (table, condition) {
  if (!condition) {
    return false
  }
  condition = ' WHERE ' + condition
  var command = 'DELETE FROM ' + table + condition
  var defered = Q.defer()
  db.query(command, defered.makeNodeResolver())
  return defered.promise
}

var close = function () {
  db.end()
}

exports.insert = insert
exports.update = update
exports.find = find
exports.remove = remove
exports.close = close

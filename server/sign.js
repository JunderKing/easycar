const md5 = require('crypto-js/md5')

var pubkey = 'hellowrold'
function sort (obj) {
  var keys = Object.keys(obj)
  keys = keys.sort()
  var newObj = {}
  keys.forEach(function (key) {
    if (key !== 'sign') {
      newObj[key.toLowerCase()] = obj.key
    }
  })
  var str = ''
  for (var key in newObj) {
    str += '&' + key + '=' + newObj[key]
  }
  str = str.substr(1)
  return str
}

function sign (obj) {
  var str = sort(obj) + pubkey
  var sign = md5(str).toString()
  return sign
}

exports.start = sign

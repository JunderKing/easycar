const url = require('url')
const querystring = require('querystring')
const fs = require('fs')
const mysql = require('./mysql.js')
const CryptoJS = require("crypto-js");
const sign = require('./sign.js')
const md5 = require("crypto-js/md5")
const Q = require('q')

var getClientIp = function(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }
    console.log("ip:" + ip);
    return ip;
};

var notfound = function(res) {
    var notfoundObj = {
        errcode: 1,
        errmsg: '404 not found!'
    }
    var notfoundJSON = JSON.stringify(notfoundObj)
    res.writeHead(404, {
        'Content-Type': 'text/plain'
    })
    res.write(notfoundJSON)
    res.end()
}

exports.filerequest = function(pathname, req, res) {
    fs.readFile('.' + pathname, 'utf-8', function(error, data) {
        if (error) {
            console.log('error')
            notfound(res)
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            })
            res.write(data.toString())
            res.end()
        }
    })
}

exports.home = function(req, res) {
    fs.readFile('./client/login.html', 'utf-8', function(error, data) {
        if (error) {
            console.log('error')
            notfound(res)
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html'
            })
            res.write(data.toString())
            res.end()
        }
    })
}

exports.checkreg = function(req, res) {
    var queryStr = url.parse(req.url).query
    var queryObj = querystring.parse(queryStr)
    if (/^1[3|4|5|7|8]\d{9}$/.test(queryObj.mobile)) {
        mysql.find('users', "tel='" + queryObj.mobile + "'", 'id').then(function(result) {
            console.log('find result :' + result[0].length)
            var resultObj = {}
            if (result[0].length !== 0) {
                resultObj.errcode = 1
                resultObj.errmsg = "此用户已经注册！"
            } else {
                resultObj.errcode = 0
                resultObj.errmsg = "success"
            }
            console.log(resultObj)
            var resultJson = JSON.stringify(resultObj)
            console.log(resultJson)
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.write(resultJson)
            res.end()
        })
    } else {
        notfound(res)
    }
}

exports.register = function(req, res) {
    var post = ''
    req.on('data', function(chunk) {
        post += chunk
    })
    req.on('end', function() {
        var dataObj = JSON.parse(post)
        var signStr = sign.start(dataObj)
        if (signStr !== dataObj.sign) {
            console.log('Wrong post sign!')
            return notfound(res)
        }
        var bytes = CryptoJS.AES.decrypt(dataObj.passwd, 'helloworld');
        var passwd = bytes.toString(CryptoJS.enc.Utf8);
        var mobile = dataObj.mobile
        var role = dataObj.role
        var ipv4 = getClientIp(req)
        console.log(ipv4)
        if (!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))) {
            console.log('Wrong mobile!')
            return notfound(res)
        }
        if (passwd.length < 7) {
            console.log('Wrong password!')
            return notfound(res)
        }
        if (role !== '0' && role !== '1') {
            console.log('Wrong role')
            return notfound(res)
        }
        if (!(/^\d{0,4}\.\d{0,4}\.\d{0,4}\.\d{0,4}$/).test(ipv4)) {
            console.log("Wrong IP!")
            ipv4 = '111.111.111.111'
                //return notfound(res)
        }
        mysql.find('users', "tel='" + mobile + "'", 'id').then(function(result) {
            if (result[0].length !== 0) {
                console.log('Duplicate register!')
                return notfound(res)
            }
            var condition = 'id=(select max(id) from users)'
            mysql.find('users', condition, 'id').then(function(result) {
                var maxid = 0
                if (result[0][0]) {
                    maxid = result[0][0].id
                }
                var salt = Math.floor(Math.random() * 90000000) + 10000000 + ''
                var passwdStr = passwd + '#' + salt
                var passcode = md5(passwdStr).toString()
                var userInfo = {
                    id: maxid + 1,
                    tel: mobile,
                    role: role,
                    cipher: passcode,
                    salt: salt,
                    ip: ipv4
                }
                mysql.insert('users', userInfo).then(function(result) {
                    var resultObj = {
                        errcode: 0,
                        errmsg: 'success'
                    }
                    var resultJson = JSON.stringify(resultObj)
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    })
                    res.write(resultJson)
                    res.end()
                })
            })
        })
    })
}

exports.login = function(req, res) {
    console.log('login invoke!')
    var post = ''
    req.on('data', function(chunk) {
        post += chunk
    })
    req.on('end', function() {
        var dataObj = JSON.parse(post)
        var signStr = sign.start(dataObj)
        if (signStr !== dataObj.sign) {
            console.log('Wrong post sign!')
            return notfound(res)
        }
        var mobile = dataObj.mobile
        if (!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))) {
            console.log('Wrong mobile!')
            return notfound(res)
        }
        var bytes = CryptoJS.AES.decrypt(dataObj.passwd, 'helloworld');
        var passwd = bytes.toString(CryptoJS.enc.Utf8);
        if (passwd.length < 7) {
            console.log('Wrong password!')
            return notfound(res)
        }
        mysql.find('users', "tel='" + mobile + "'", null).then(function(result) {
            if (result[0].length === 0) {
                console.log('Not registered!')
                return notfound(res)
            }
            var salt = result[0][0].salt
            var cipher = result[0][0].cipher
            var answerStr = passwd + '#' + salt
            var answerCode = md5(answerStr).toString()
            if (answerCode !== cipher) {
                console.log('Wrong password')
                return notfound(res)
            }
            var resultObj = {
                errcode: 0,
                errmsg: 'success',
                uid: result[0][0].id,
                role: result[0][0].role
            }
            var resultJson = JSON.stringify(resultObj)
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })
            res.write(resultJson)
            res.end()
        })
    })
}

exports.getuserinfo = function(req, res) {
  console.log('getuserinfo');
  var queryStr = url.parse(req.url).query
  var queryObj = querystring.parse(queryStr)
  var signature = sign.start(queryObj)
  if (signature!==queryObj.sign) {
    console.log("Wrong signature!");
    return notfound(res)
  }
  var uid = queryObj.uid
  if (!uid) {
    console.log("No uid!");
    return notfound(res)
  }
  console.log(uid);
  mysql.find('users', 'id='+uid, null).then(function(result){
    if (!result[0][0]) {
      console.log("Can not find user");
      return notfound(res)
    }
    var resObj = result[0][0]
    var resJson = JSON.stringify(resObj)
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end(resJson)
  })
}
exports.searchaddr = function(req, res) {
    var queryStr = url.parse(req.url).query
    var queryObj = querystring.parse(queryStr)
    var str = queryObj.str
    if (str.length === 0) {
        return notfound(res)
    }
    var condition = "addr like '%" + str + "%'"
    mysql.find('addrs', condition, 'addr_id, addr').then(function(result) {
        console.log('result:' + result[0]);
        var obj = {
            arr: result[0]
        }
        var jsonStr = JSON.stringify(obj)
        console.log('jsonStr' + jsonStr);
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.write(jsonStr)
        res.end()
    })
}
exports.searchcar = function(req, res) {
  console.log('searchcar');
    var queryStr = url.parse(req.url).query
    var queryObj = querystring.parse(queryStr)
    var str = queryObj.str
    if (str.length === 0) {
        return notfound(res)
    }
    var condition = "car_brand like '%" + str + "%'"
    mysql.find('cars', condition, null).then(function(result) {
        console.log('result:' + result[0]);
        var obj = {
            arr: result[0]
        }
        var jsonStr = JSON.stringify(obj)
        console.log('jsonStr' + jsonStr);
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.write(jsonStr)
        res.end()
    })
}
exports.getrecordlist = function(req, res) {
    var queryStr = url.parse(req.url).query
    var queryObj = querystring.parse(queryStr)
    var uid = queryObj.uid
    var role = queryObj.role
    console.log('uid:' + uid+"role:"+role);
    if (!uid||!role) {
        return notfound(res)
    }
    var condition = null
    if (role==='0') {
      condition = "pasnger_id=" + uid
    } else if (role==='1') {
      condition = "driver_id=" + uid
    }
    mysql.find('pasnger_logs', condition, null).then(function(result) {
        if (result[0].length === 0) {
            return notfound(res)
        }
        var obj = {
            arr: result[0]
        }
        console.log('obj:' + obj);
        var jsonStr = JSON.stringify(obj)
        console.log('jsonStr:' + jsonStr);
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.write(jsonStr)
        res.end()
    })
}
exports.getrecorddetail = function(req, res) {
    var queryStr = url.parse(req.url).query
    var queryObj = querystring.parse(queryStr)
    var logId = queryObj.logId
    if (!logId) {
        return notfound(res)
    }
    mysql.find('pasnger_logs', "log_id=" + logId, null).then(function(result) {
        if (result[0].length === 0) {
            return notfound(res)
        }
        var jsonStr = JSON.stringify(result[0][0])
        console.log('jsonStr:' + jsonStr);
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.write(jsonStr)
        res.end()
    })
}

exports.matchdriver = function(req, res) {
    var queryStr = url.parse(req.url).query
    var queryObj = querystring.parse(queryStr)
    var destId = queryObj.destId
    if (!destId) {
      console.log('No destId');
      return notfound(res)
    }
    mysql.find('driver_dests', "dest_id='" + destId + "'", 'uid').then(function(result) {
        if (result[0].length === 0) {
            console.log('No driver!');
            return notfound(res)
        }
        var uids = result[0].map(function(item) {
            return item.uid
        })
        Q.all([mysql.find('users', "id in ("+ uids.join(',')+")", null),mysql.find('driver_cars', "uid in (" + uids.join(',') + ")", null)]).then(function (results){
          var driverInfos = results[0][0]
          var driverCars = results[1][0]
          var carIds = []
          driverCars.forEach(function(item) {
              if (carIds.indexOf(item.car_id) === -1) {
                  carIds.push(item.car_id)
              }
          })
          mysql.find('cars', "id in (" + carIds.join(',') + ")", null).then(function(result) {
              var carInfos = result[0]
              var obj = {
                driverInfos: driverInfos,
                driverCars: driverCars,
                carInfos: carInfos
              }
              var jsonStr = JSON.stringify(obj)
              res.writeHead(200, {
                  'Content-Type': 'text/plain'
              })
              res.write(jsonStr)
              res.end()
          })
        })
    })
}
exports.saverecord = function(req, res) {
  var post = ''
  req.on('data', function(chunk) {
      post += chunk
  })
  req.on('end', function(){
    var reqObj = JSON.parse(post)
    if (reqObj.sign!==sign.start(reqObj)) {
      return console.log("Wrong signature!");
    }
    delete reqObj.sign
    var condition = 'log_id=(select max(log_id) from pasnger_logs)'
    mysql.find('pasnger_logs', condition, 'log_id').then(function (results) {
      var maxId = 0
      if (results[0][0]) {
        maxId = results[0][0].log_id
      }
      reqObj.log_id = maxId + 1
      mysql.insert('pasnger_logs', reqObj).then(function(result){
        var resObj = {
          errcode: 0,
          errmsg: 'success'
        }
        var resJson = JSON.stringify(resObj)
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        })
        res.write(resJson)
        res.end()
      })
    })
  })
}

exports.adddest = function(req, res){
  var queryStr = url.parse(req.url).query
  var queryObj = querystring.parse(queryStr)
  console.log(queryObj);
  var destId = queryObj.destId
  var uid = queryObj.uid
  if (!destId||!uid) {
    console.log('No destId or uid'+destId+uid);
    return notfound(res)
  }
  var obj = {
    uid: uid,
    dest_id: destId
  }
  mysql.insert('driver_dests', obj).then(function(result){
    var resObj = {
      errcode: 0,
      errmsg: 'success'
    }
    var resJson = JSON.stringify(resObj)
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end(resJson)
  })
}

exports.addcar = function(req, res){
  var queryStr = url.parse(req.url).query
  var queryObj = querystring.parse(queryStr)
  var carId = queryObj.carId
  var uid = queryObj.uid
  if (!carId||!uid) {
    console.log('No carId or uid');
    return notfound(res)
  }
  var obj = {
    uid: uid,
    car_id: carId
  }
  mysql.insert('driver_cars', obj).then(function(result){
    var resObj = {
      errcode: 0,
      errmsg: 'success'
    }
    var resJson = JSON.stringify(resObj)
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end(resJson)
  }, function(error){
    var resObj = {
      errcode: 1,
      errmsg: 'insert failed!'
    }
    var resJson = JSON.stringify(resObj)
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.end(resJson)
  })
}

exports.notfound = notfound

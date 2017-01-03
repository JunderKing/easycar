const handler = require('./handler')
const url = require('url')
const qs = require('querystring')
const sign = require('./sign.js')

var handle = {}
handle['/'] = handler.home
handle['/checkreg'] = handler.checkreg
handle['/register'] = handler.register
handle['/login'] = handler.login
handle['/searchaddr'] = handler.searchaddr
handle['/getrecordlist'] = handler.getrecordlist
handle['/getrecorddetail'] = handler.getrecorddetail
handle['/matchdriver'] = handler.matchdriver
handle['/saverecord'] = handler.saverecord
handle['/adddest'] = handler.adddest
handle['/searchcar'] = handler.searchcar
handle['/addcar'] = handler.addcar
handle['/getorderlist'] = handler.getorderlist
handle['/getorderdetail'] = handler.getorderdetail
handle['/getuserinfo'] = handler.getuserinfo

var signVerify = function (req) {
  if (req.method === 'GET') {
    var queryStr = url.parse(req.url).query
    if (queryStr) {
      var queryObj = qs.parse(queryStr)
      var signStr = sign.start(queryObj)
      if (queryObj.sign !== signStr) {
        console.log('wrong sign!')
        return false
      }
    }
  }
  return true
}

var route = function (req, res) {
  var isCorrect = signVerify(req)
  if (!isCorrect) {
    return handler.notfound(res)
  }
  var pathname = url.parse(req.url).pathname
  console.log(pathname)
  if (pathname.substring(0, 7) === '/client') {
    handler.filerequest(pathname, req, res)
    return
  }
  if (typeof (handle[pathname]) === 'function') {
    handle[pathname](req, res)
  } else {
    handler.notfound(res)
  }
}

exports.route = route

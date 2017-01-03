const http = require('http')
const router = require('./router.js')

var start = function () {
  http.createServer(function (req, res) {
    router.route(req, res)
  }).listen(8888)
  console.log('server started!')
}

exports.start = start

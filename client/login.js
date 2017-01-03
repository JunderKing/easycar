function checkmobile (str) {
  if (!(/^1[3|4|5|7|8]\d{9}$/.test(str))) {
    return console.log('手机号输入有误！')
  }
}

function login () {
  var mobile = document.getElementsByName('mobile')[0].value
  var passwd = document.getElementsByName('passwd')[0].value
  if (!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))) {
    return console.log('手机号输入有误！')
  }
  if (passwd.length<7) {
    return console.log("密码至少需要6位！")
  }
  var ciphertext = CryptoJS.AES.encrypt(passwd, 'helloworld').toString();
  var obj = {
    "mobile": mobile,
    "passwd": ciphertext
  }
  obj.sign = sign(obj)
  var jsonStr = JSON.stringify(obj)
  console.log('request json:'+jsonStr)
  var xmlhttp
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest()
  } else {
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      var text = xmlhttp.responseText
      var obj = JSON.parse(text)
      localStorage.setItem('userId', obj.uid)
      if (obj.role===0) {
        window.location.href="/client/pasnger/pasngerHome.html"
      }
      if (obj.role===1) {
        window.location.href = "/client/driver/driverHome.html"
      }
      console.log(obj)
    }
  }
  xmlhttp.open('POST', '/login', true)
  xmlhttp.setRequestHeader("Content-type","text/plain")
  xmlhttp.send(jsonStr)
}

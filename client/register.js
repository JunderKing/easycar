function request(method, url, data, callback){
  var xmlhttp
  if (window.XMLHttpRequest){
    xmlhttp=new XMLHttpRequest();
  }
  else{
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange= function(){
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      callback(xmlhttp.responseText)
    }
  };
  xmlhttp.open(method, url, true);
  xmlhttp.send(data);
}

function checkmobile (str) {
  if (!(/^1[3|4|5|7|8]\d{9}$/.test(str))) {
    return console.log('手机号输入有误！')
  }
  var obj = {
    mobile: str
  }
  var signStr = sign(obj)
  var xmlhttp
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest()
  } else {
    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP')
  }
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      var result = JSON.parse(xmlhttp.responseText)
      if (result.errcode===1) {
        return console.log(result.errmsg)
      }
      return console.log(result.errmsg)
    }
  }
  xmlhttp.open('POST', '/checkreg?mobile='+str+'&sign='+signStr, true)
  xmlhttp.send()
}

function checkpasswd (str){
  if (str.length<7) {
    return console.log("密码长度至少6位！")
  }
}

function confirmpasswd (str) {
  var passwd1 = document.getElementsByName('passwd1')[0].value
  if (str!==passwd1) {
    return console.log("两次输入的密码不一致!")
  }
}

function register (){
  var mobile = document.getElementsByName('mobile')[0].value
  var passwd1 = document.getElementsByName('passwd1')[0].value
  var passwd2 = document.getElementsByName('passwd2')[0].value
  var role = document.getElementsByName('role')[0].value
  if (!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))) {
    return console.log('手机号输入有误！')
  }
  if (passwd1.length<7) {
    return console.log("密码长度不少于6位！")
  }
  if (passwd1!==passwd2) {
    return console.log("两次输入的密码不一致！")
  }
  if (role!=='0'&&role!=='1') {
    return console.log("role错误！")
  }
  var ciphertext = CryptoJS.AES.encrypt(passwd1, 'helloworld').toString();
  var obj = {
    mobile: mobile,
    role: role,
    passwd: ciphertext
  }
  obj.sign = sign(obj)
  var jsonStr = JSON.stringify(obj)
  console.log("request json:"+jsonStr)
  request('POST', '/register', jsonStr, function (resJson) {
      var result = JSON.parse(resJson)
      if (result.errcode!==0) {
        return console.log(result.errmsg)
      }
      console.log("注册成功！请登录：")
      window.location.href= '/'
  })
}

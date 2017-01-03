window.onload = function () {
  var currentUser = localStorage.getItem('userId')
  if (!currentUser) {
    return console.log('No currentUser!');
  }
  var reqObj = {
    uid: currentUser
  }
  var signature = sign(reqObj)
  var url = "/getuserinfo?uid="+currentUser+"&sign="+signature
  console.log(url);
  request('GET', url, null, function(resJson){
    var resObj = JSON.parse(resJson)
    console.log(resObj);
    var str = "ID:"+resObj.id+"；手机号:"+resObj.tel+"；角色："+resObj.role
    document.getElementsByClassName('user-info')[0].innerHTML = str
  })
}

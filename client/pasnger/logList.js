window.onload = function (){
  var uid = localStorage.getItem('userId')
  if (!uid) {
    return console.log('Pleast login first!')
  }
  var obj = {
    uid: uid
  }
  var signature = sign(obj)
  request("GET", '/getrecordlist?uid='+uid+"&sign="+signature, null, function(logJson){
    var logObj = JSON.parse(logJson)
    var logArr = logObj.arr
    console.log(logArr)
    if (logArr.length===0) {
      var p = document.createElement("p")
      p.innerHTML = "您还没有打车记录！"
      var back = document.createElement('a')
      back.innerHTML = "返回"
      back.href = "/client/pasnger/pasngerHome.html"
      var callCar = document.createElement('a')
      callCar.innerHTML = "现在用车"
      callCar.href = "/client/pasnger/callCar.html"
      document.body.appendChild(p)
      document.body.appendChild(back)
      document.body.appendChild(callCar)
    } else {
      var ul = document.createElement('ul')
      document.body.appendChild(ul)
      var a = null
      var li = null
      logArr.forEach(function(item){
        console.log(item);
        a = document.createElement('a')
        a.innerHTML = item.total_money
        a.onclick = function(){
          console.log('hello:'+item.log_id);
          localStorage.setItem('logId', parseInt(item.log_id))
          window.location.href = '/client/pasnger/logDetail.html'
        }
        li = document.createElement('li')
        li.appendChild(a)
        ul.appendChild(li)
      })
    }
  })
}

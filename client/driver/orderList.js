window.onload = function (){
  var uid = localStorage.getItem('userId')
  if (!uid) {
    return console.log('Pleast login first!')
  }
  console.log(typeof(uid));
  var obj = {
    uid: uid,
    role: '1'
  }
  var signature = sign(obj)
  var url = '/getrecordlist?uid='+uid+"&role="+obj.role+"&sign="+signature
  console.log(url);
  request("GET", url, null, function(logJson){
    var logObj = JSON.parse(logJson)
    var logArr = logObj.arr
    console.log(logArr)
    if (logArr.length===0) {
      var p = document.createElement("p")
      p.innerHTML = "您还没有接单记录！"
      document.body.appendChild(p)
    } else {
      var ul = document.createElement('ul')
      document.body.appendChild(ul)
      var a = null
      var li = null
      logArr.forEach(function(item){
        a = document.createElement('a')
        a.innerHTML = item.total_money
        a.onclick = function(){
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

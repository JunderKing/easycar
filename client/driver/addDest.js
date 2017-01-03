function searchAddr(str, target){
  if (str.length===0) {
    var clearNode = document.getElementsByClassName('addr-box')[0]
    if (clearNode) {
      clearNode.parentNode.removeChild(clearNode)
    }
    return
  }
  var obj = {
    str: str
  }
  var signature = sign(obj)
  request('GET', '/searchaddr?str='+str+'&sign='+signature, null, function(resJson){
    var resObj = JSON.parse(resJson)
    var resArr = resObj.arr
    if (resArr.length===0) {
      return console.log("未查询到相关地址!");
    }
    var clearNode = document.getElementsByClassName('addr-box')[0]
    if (clearNode) {
      clearNode.parentNode.removeChild(clearNode)
    }
    var div = document.createElement('div')
    div.className = 'addr-box'
    var parent = target.parentNode;
    parent.insertBefore(div, target.nextSibling)
    var p = null
    var input = document.getElementsByName('origin')[0]
    resArr.forEach(function(item){
      p = document.createElement('p')
      p.innerHTML = item.addr
      p.onclick = function(){
        console.log('target name: '+ target.name);
        localStorage.setItem(target.name, item.addr_id)
        target.value = item.addr
        div.parentNode.removeChild(div)
        var btn = document.getElementsByName('submit-btn')[0]
        btn.hidden = false
      }
      div.appendChild(p)
    })
  })
}

function addDest(){
  var userId = localStorage.getItem('userId')
  var destId = localStorage.getItem('dest')
  if (!userId||!destId) {
    return console.log('no userId or no destId');
  }
  var reqObj = {
    uid: userId,
    destId: destId
  }
  var signature = sign(reqObj)
  var url = "/adddest?uid="+userId+"&destId="+destId+"&sign="+signature
  console.log(url);
  request('GET', url, null, function(resJson){
    var resObj = JSON.parse(resJson)
    console.log(resObj);
    if (resObj.errcode===0) {
      return console.log('success');
    }
  })
}

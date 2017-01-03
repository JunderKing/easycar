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
        if (target.name==='dest') {
          matchDriver()
        }
      }
      div.appendChild(p)
    })
  })
}

function matchDriver(){
  var uid = localStorage.getItem('userId')
  if (!uid) {
    return console.log("请先登录!");
  }
  var originId = localStorage.getItem('origin')
  if (!originId) {
    return console.log("请选择起点！");
  }
  var destId = localStorage.getItem('dest')
  if (!destId) {
    return console.log("请选择终点!");
  }
  var obj = {
    uid: uid,
    destId: destId
  }
  var signature = sign(obj)
  var url = "/matchdriver?uid="+uid+"&destId="+destId+"&sign="+signature
  console.log("get:"+url);
  request('GET', url, null, function(resJson){
    resObj = JSON.parse(resJson)
    console.log(resObj)
    var cate0, cate1, cate2, cate3, cate4, option
    resObj.carInfos.forEach(function(item){
      if (item.category===0) {
        cate0 = true
      } else if (item.category===1) {
        cate1 = true
      } else if (item.category===2) {
        cate2 = true
      } else if (item.category===3) {
        cate3 = true
      } else {
        cate4 = true
      }
    })
    var cateSelect = document.getElementsByName('category')[0]
    if (cate0) {
      option = document.createElement('option')
      option.value = 0
      option.innerHTML = 'YOUNG'
      cateSelect.appendChild(option)
    }
    if (cate1) {
      option = document.createElement('option')
      option.value = 1
      option.innerHTML = '舒适'
      cateSelect.appendChild(option)
    }
    if (cate2) {
      option = document.createElement('option')
      option.value = 2
      option.innerHTML = '商务'
      cateSelect.appendChild(option)
    }
    if (cate3) {
      option = document.createElement('option')
      option.value = 3
      option.innerHTML = '豪华'
      cateSelect.appendChild(option)
    }
    if (cate4) {
      option = document.createElement('option')
      option.value = 4
      option.innerHTML = '其它'
      cateSelect.appendChild(option)
    }
    cateSelect.hidden=false
    cateFilter()
    var callBtn = document.getElementsByName('call-car')[0]
    callBtn.hidden = false
  })
}

function cateFilter () {
  if (!resObj) {
    return console.log('No resObjs!');
  }
  var currentCate = document.getElementsByName('category')[0].value
  console.log('currentCate:'+currentCate);
  if (!currentCate) {
    return console.log("No category!");
  }
  avlDrivers = []
  resObj.carInfos.forEach(function(carInfo){
    if (carInfo.category+'' === currentCate) {
      resObj.driverCars.forEach(function(driverCar){
        if (driverCar.car_id===carInfo.id) {
          resObj.driverInfos.forEach(function(driverInfo){
            if (driverInfo.id===driverCar.uid) {
              driverInfo.carInfo = carInfo
              avlDrivers.push(driverInfo)
            }
          })
        }
      })
    }
  })
  console.log(avlDrivers);
}

function callCar (){
  if (!avlDrivers) {
    return console.log('no avlDrivers');
  }
  var callBtn = document.getElementsByName('call-car')[0]
  callBtn.hidden = true
  var timerId = setInterval(function(){
    if (avlDrivers.length===0) {
      return clearInterval(timerId)
    }
    var randomIndex = Math.floor(Math.random()*avlDrivers.length)
    var driverInfo = avlDrivers.splice(randomIndex, 1)[0]
    var str = 'ID:' + driverInfo.id+"，手机："+driverInfo.tel + " 抢单！"
    var div = document.getElementsByClassName('order-box')[0]
    var p = document.createElement('p')
    p.innerHTML = str
    p.onclick = function(){
      clearInterval(timerId)
      currentDriver = driverInfo
      var childs = div.childNodes
      for(var i = childs.length - 1; i >= 0; i--) {
        div.removeChild(childs[i]);
      }
      var infoP = document.createElement('p')
      var info = "行程："+ localStorage.getItem('origin') + "=>"+ localStorage.getItem('dest') +
      "；司机手机号："+driverInfo.tel + "；"
      infoP.innerHTML = info
      var startBtn = document.getElementsByName('start')[0]
      startBtn.hidden = false
    }
    div.appendChild(p)
  }, 2000)
}

function start (){
  time = 0
  distance = 0
  currentMoney = 0
  var pasngerP = document.getElementsByClassName('pasnger-log')[0]
  var driverP = document.getElementsByClassName('driver-log')[0]
  var shareTimer = setInterval(function () {
    time++
    var randomDist = Math.floor(Math.random() * 5 + 5) / 10.0
    distance += randomDist
  }, 5000)
  console.log(currentDriver.carInfo);
  pasngerTimer = setInterval(function () {
    currentMoney = currentDriver.carInfo.start_price + currentDriver.carInfo.time_price * time + currentDriver.carInfo.dist_price * distance.toFixed(1)
    pasngerP.innerHTML = '乘客=> 实时花费：' + currentMoney + '元'
  }, 2000)
  driverTimer = setInterval(function () {
    driverP.innerHTML = '司机=> 时间:' + time + 'min；路程:' + distance.toFixed(1) + '公里'
  }, 3000)
  var startBtn = document.getElementsByName('start')[0]
  var endBtn = document.getElementsByName('end')[0]
  startBtn.hidden = true
  endBtn.hidden = false
}

function end (){
  clearInterval(pasngerTimer)
  clearInterval(driverTimer)
  var log = {
    pasnger_id: localStorage.getItem('userId'),
    driver_id: currentDriver.id,
    origin_id: localStorage.getItem('origin'),
    dest_id: localStorage.getItem('dest'),
    total_money: currentMoney,
    dist_money: distance * currentDriver.carInfo.dist_price,
    time_money: time * currentDriver.carInfo.time_price
  }
  log.sign = sign(log)
  var reqJson = JSON.stringify(log)
  request('POST', '/saverecord', reqJson, function(resJson){
    var resObj = JSON.parse(resJson)
    console.log(resObj);
    if (resObj.errcode===0) {
      var settleP = document.getElementsByClassName('settlement')[0]
      var str = "总时间："+time + "分钟；总距离："+distance.toFixed(1)+"公里；总消费："+currentMoney+"元"
      settleP.innerHTML = str
    } else {
      console.log('Wrong respose!');
    }
  })
}

function searchCar(str, target){
  if (str.length===0) {
    var clearNode = document.getElementsByClassName('car-brand-box')[0]
    if (clearNode) {
      clearNode.parentNode.removeChild(clearNode)
    }
    return
  }
  var obj = {
    str: str
  }
  var signature = sign(obj)
  var url = '/searchcar?str='+str+'&sign='+signature
  console.log(url);
  request('GET', url, null, function(resJson){
    var resObj = JSON.parse(resJson)
    console.log(resObj);
    var resArr = resObj.arr
    if (resArr.length===0) {
      return console.log("未查询到相关信息!");
    }
    var clearNode = document.getElementsByClassName('car-brand-box')[0]
    if (clearNode) {
      clearNode.parentNode.removeChild(clearNode)
    }
    var div = document.createElement('div')
    div.className = 'car-brand-box'
    var parent = target.parentNode;
    parent.insertBefore(div, target.nextSibling)
    var p = null
    var input = document.getElementsByName('origin')[0]
    var brandArr = []
    resArr.forEach(function(item){
      if (brandArr.indexOf(item.car_brand)===-1) {
        brandArr.push(item.car_brand)
      }
    })
    brandArr.forEach(function(brand){
      p = document.createElement('p')
      p.innerHTML = brand
      p.onclick = function(){
        target.value = brand
        div.parentNode.removeChild(div)
        var avlCars = resArr.filter(function(carInfo){
          if (carInfo.car_brand===brand) {
            return true
          }
        })
        var typeSelect = document.getElementsByName('car-type')[0]
        typeSelect.hidden = false
        var option = null
        avlCars.forEach(function(item){
          option = document.createElement('option')
          option.innerHTML = item.car_type
          option.value = item.id
          typeSelect.appendChild(option)
        })
        var submitBtn = document.getElementsByName('submit-btn')[0]
        submitBtn.hidden = false
      }
      div.appendChild(p)
    })
  })
}

function addCar(){
  var typeSelect = document.getElementsByName('car-type')[0]
  var carId = parseInt(typeSelect.value)
  var uid = localStorage.getItem('userId')
  var reqObj = {
    uid: uid,
    carId: carId
  }
  var signature = sign(reqObj)
  var url = '/addcar?uid='+uid+'&carId='+carId+'&sign='+signature
  console.log(url);
  request('GET', url, null, function(resJson){
    var resObj = JSON.parse(resJson)
    console.log(resObj.errmsg);
  })
}

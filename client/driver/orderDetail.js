window.onload = function(){
  console.log('onload');
  var logId = localStorage.getItem('logId')
  console.log('logid:'+typeof(logId));
  if (!logId) {
    return console.log('No logId!')
  }
  var obj = {
    logId: logId
  }
  var signature = sign(obj)
  request('GET', '/getrecorddetail?logId='+logId+'&sign='+signature, null, function(detailJson){
    var detailObj = JSON.parse(detailJson)
    console.log(detailObj);
    document.getElementsByClassName('detail')[0].innerHTML = "startTime:"+detailObj.start_time+"\nlogId:"+detailObj.log_id
  })
}

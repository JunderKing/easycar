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

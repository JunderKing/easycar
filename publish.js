const fs = require('fs');
const readline = require('readline');
var content = fs.readFileSync('\addresses.txt', 'UTF-8');
var arr = content.split('\r');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var oriAdd = null;
var endAdd = null;
var result = null;
var searchAdd = function(position){
  rl.question('请输入'+position+'位置(输入back返回上一级)：', (answer)=>{
    if (answer==='back'&&position==='起点') {
      rl.close();
      return;
    }
    if (answer==='back'&&position==='终点') {
      console.log(result.join('\n'));
      selectAdd('起点', result)
      return;
    }
    var charCode = answer.toLowerCase().charCodeAt(0);
    result = [];
    if (answer.length===1&&charCode>=97&&charCode<=122) {
      result = arr.filter(function(item){
        if (item.split('-')[2]===answer.toUpperCase()) {
          return true;
        }
      })
    }else {
      result = arr.filter(function(item){
        if (item.split('-')[3].match(answer)) {
          return true;
        }
      })
    }
    if (result.length===0) {
      console.log('未查询到相关地址！');
      searchAdd(position);
    }else {
      console.log(result.join('\n'));
      selectAdd(position, result);
    }
  })
}
var selectAdd = function(position, result){
  rl.question('请输入ID选择'+position+'地址(输入back返回上一级)：', (answer)=>{
    if (answer==='back') {
      searchAdd(position);
      return;
    }
    for (var i = 0; i < result.length; i++) {
      if (result[i].split('-')[0]===answer) {
        console.log(position+'设定为：'+result[i]);
        if (position==='起点') {
          oriAdd = result[i]
          searchAdd('终点')
        }
        if (position==='终点') {
          endAdd = result[i]
          var distance = Math.floor(Math.random()*50)
          console.log('起点：'+oriAdd.split('-')[3]+'=>终点：'+endAdd.split('-')[3]+';距离：'+distance+'km');
          rl.close();
        }
        return;
      }
    }
    console.log('ID输入有误！');
    selectAdd(position, result);
  })
}
searchAdd('起点');

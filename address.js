const fs = require('fs');
const readline = require('readline');
var arr = null;
var content = fs.readFileSync('\addresses.txt', 'UTF-8');
var arr = content.split('\r');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var method = function(){
  rl.question('请选择查询方式(a-按id查询；b-按区域查询；c-按首字母查询；d-按名称查询；q-退出)：\n', (answer) =>{
    if (answer==='q') {
      rl.close();
    }else if (answer==='a'||answer==='b'||answer==='c'||answer==='d') {
      var field = null;
      var index = null;
      switch (answer) {
        case 'a':
          field = 'ID';
          index = 0;
          break;
        case 'b':
          field = '区域'
          index = 1;
          break;
        case 'c':
          field = '首字母'
          index = 2;
          break;
        case 'd':
          field = '名称'
          index = 3;
          break;
        default:
      };
      query(field, index);
    }else {
      console.log('输入错误！');
      method();
    }
  })
};
var query = function(field, index){
  rl.question('请输入' + field + '(quit-返回上级菜单)：', (answer) =>{
    if (answer==='quit') {
      method();
      return;
    }
    var result = arr.filter(function(item){
      var address = item.split('-');
      if (address[index]===answer.toUpperCase()) {
        return true;
      }
    })
    if (result.length===0) {
      console.log('未查询到相关信息!');
    }else {
      console.log('查询结果为：\n'+result.join('\n'));
    }
    query(field, index);
  })
}
method();

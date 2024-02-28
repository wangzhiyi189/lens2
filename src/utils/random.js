
function generateRandomNumbers(total){
  // 如果不传total或者传0，设置成10位。
  total = total == undefined || total == 0  ? 10 : total;
  let str = '';
  for (let i = 0; i < total; i++) {
    let number = parseInt(Math.random() * 35);
    // 当前生成的随机数大于等于10则进行转换。
    if(number >= 10){
      str += numberConvertEnglishLetters(number);
    }else{
      str += number.toString();
    }
  }
  return str;
}
 
 
 
function numberConvertEnglishLetters(number){
  let map = numberConvertEnglishLettersMap();
  for (let i = 0; i < map.length; i++) {
    if(map[i].key == number){
      return map[i].value;
    }
  }
}
 
function numberConvertEnglishLettersMap(){
  return [
    {'key':10,'value':'a'},
    {'key':11,'value':'b'},
    {'key':12,'value':'c'},
    {'key':13,'value':'d'},
    {'key':14,'value':'e'},
    {'key':15,'value':'f'},
    {'key':16,'value':'g'},
    {'key':17,'value':'h'},
    {'key':18,'value':'i'},
    {'key':19,'value':'j'},
    {'key':20,'value':'k'},
    {'key':21,'value':'l'},
    {'key':22,'value':'m'},
    {'key':23,'value':'n'},
    {'key':24,'value':'o'},
    {'key':25,'value':'p'},
    {'key':26,'value':'q'},
    {'key':27,'value':'r'},
    {'key':28,'value':'s'},
    {'key':29,'value':'t'},
    {'key':30,'value':'u'},
    {'key':31,'value':'v'},
    {'key':32,'value':'w'},
    {'key':33,'value':'x'},
    {'key':34,'value':'y'},
    {'key':35,'value':'z'},
  ];
}

export default generateRandomNumbers


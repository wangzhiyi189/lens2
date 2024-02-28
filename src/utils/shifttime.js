// 根据时间戳判断刚刚今天昨天
function pairNum(num) {
  return (String(num).length == 1 ? '0' : '') + num;
}

export const shiftTime = timestamp => {
  if (!timestamp) return;
  var timestamp = (new Date(timestamp).getTime()/1000)
  var curTimestamp = parseInt(new Date().getTime()/1000); //当前时间戳
  var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
  var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  var tmDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象
  var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
  var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();
  if (timestampDiff < 3600) { // 一分钟以内
      // return "今天";
      return Math.floor(timestampDiff / 60) + 'min'
      // return '今天' + pairNum(H) + ':' + pairNum(i);
  } else if (timestampDiff > 3600 &&timestampDiff < 36000) { // 一小时前之内
    return Math.floor(timestampDiff / 3600) + 'h'
      // return '今天' + pairNum(H) + ':' + pairNum(i);
  }else {
      var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
      if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
          return '昨天' + pairNum(H) + ':' + pairNum(i);
      } else if (curDate.getFullYear() == Y) {
          return pairNum(m) + '-' + pairNum(d) + '  ' + pairNum(H) + ':' + pairNum(i);
      } else {
          return Y + '年' + pairNum(m) + '-' + pairNum(d) + '- ' + pairNum(H) + ':' + pairNum(i);
      }
  }
};
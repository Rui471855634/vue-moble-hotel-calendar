/**
 * 格式化时间
 *
 * @export
 * @param {any} fmt 时间格式
 * @param {any} date 时间戳数据
 * @returns
 */
export function dateFtt(fmt, date) { //dateFtt('yyyy-MM-dd hh:mm:ss',a)
  let time
  if (!date) {
    return ''
  }
  if (typeof date === 'string') {
    time = new Date(date.replace(/-/g, '/').replace(/T|Z/g, '').trim())
  } else if (typeof date === 'object') {
    time = new Date(date)
  }
  var o = {
    "M+": time.getMonth() + 1, //月份
    "d+": time.getDate(), //日
    "h+": time.getHours(), //小时
    "m+": time.getMinutes(), //分
    "s+": time.getSeconds(), //秒
    "q+": Math.floor((time.getMonth() + 3) / 3), //季度
    "S": time.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1, (RegExp.$1.length == 1) ?
        (o[k]) :
        (("00" + o[k]).substr(("" + o[k]).length)))
  return fmt
}

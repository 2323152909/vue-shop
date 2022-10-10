// 对日期进行格式化的工具类
export function dateFormat(originVal){
  // 定义一个日期对象
  const date = new Date(originVal*1000);
  // 获取完整的年份
  const yyyy = date.getFullYear();
  // 获取月份
  const MM = (date.getMonth() + 1 + '').padStart(2, '0'); //月份默认从0开始，不足两位，用0填充
  // 获取几日
  const dd = (date.getDate() + '').padStart(2, '0');//转为字符串，不足两位，首位用0填充
  // 获取小时
  const hh = (date.getHours() + '').padStart(2, '0');//同理
  // 获取分钟
  const mm = (date.getMinutes() + '').padStart(2, '0');// 同理
  // 获取秒
  const ss = (date.getSeconds() + '').padStart(2, '0');// 同理

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}
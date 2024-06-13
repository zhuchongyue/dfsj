import get        from "lodash-es/get";
//@ts-ignore
import {DateTime} from "luxon";
//@ts-ignore
import {Interval} from "luxon";
import {Visual}   from "../types";

/**
 * 计算节点数量时的节点调整量，调整量为1或者0，不存在其他值！
 *
 * 具体调整量由服务端的时间计算范围相关，请和后端确认！
 */
const TIME_DIFF_ADJUST = 1;

/**
 * 根据时间范围、单位及间隔计算节点数量。
 * @param range 时间范围
 * @param symbol 时间单位
 * @param interval 时间间隔
 */
export function getCount(range: Visual.DateRange, symbol: Visual.DateUnit, interval: number) {
  let between = Interval.fromDateTimes(range[0], range[1]);
  if (symbol === "xun") {
    let xunOf = time => Math.floor(time.day / 10);
    let count = Math.max(Math.floor(between.count("month") - 2), 0);
    return (3 - xunOf(range[0])) + xunOf(range[1]) + count * 3;
  }
  return Math.round(range[1].diff(range[0], symbol).get(symbol) / interval) + TIME_DIFF_ADJUST;
}

/**
 * 对模板字符串进行格式化，从节点信息中获取参数，包括：节点时间，图例信息、用户信息等。
 * 对时间的参数获取，可能需要对时间进行调整，比如把时间转换为毫秒，加减一个offset等。
 *
 * 每个参数的格式为：{name}，中括号表示要获取参数，name表示参数名称。
 *
 * 时间的参数由时间格式字符串和修饰符组成：{time@yyyy-MM-DD HH:mm:ss??@xxx}，其中：
 *
 * time后面的表达式表示时间格式化模板（用于获取精准时间），@后面表示修饰符，
 * 每个修饰符由@+参数，可选的修饰符有：
 *
 * * @< : 表示获取当前节点的上一节点时间
 * * @> ：表示获取当前节点的下一节点时间
 * * @today[(::)|(<<)]expression|format : 表示当节点时间大于今天时，对时间进行调整，调整方案为：
 * 1. 如果today后面为"<<"，那么将取上一个节点时间为节点时间
 * 2. 如果today后面为"::"，那么将取当前时间为节点时间
 * expression为当前时间表达式，仅包含时分秒，format为日期新格式（如果存在将舍去time#后面的格式）。
 *
 * @param pattern
 * @param nodeInfo
 */
const reg = /{(.+?)?}/g;     //
export function toFormat(pattern: string, nodeInfo: Visual.NodeInfo): string {
  let now       = DateTime.fromMillis(Date.now());
  // let now       = DateTime.fromSQL("2022-11-24 06:00:00");
  let exec, buf = pattern;
  while (exec = reg.exec(pattern)) {
    let items = exec[1].split("#");
    let value = get(nodeInfo, items[0]);
    if (items.length === 1) {           // 如果不是取得时间字段，则直接获取值
      buf = buf.replace(exec[0], value == null ? "" : String(value));
    } else if (items[0] === "time") {   // 如果取得是时间字段，则需要对时间进行处理（time后面必须跟随"#"）
      let time: DateTime | number = <DateTime>value;
      let modifiers: string[]     = items[1].split("@");
      let format                  = modifiers[0];
      if (modifiers.length > 0) {
        // 如果包含"<"修饰符，则表示取上一个节点时间作为当前节点时间
        if (modifiers.includes("<")) {
          time = time.plus({[nodeInfo.unit]: -nodeInfo.step});
        }
        // 如果包含">"修饰符，则表示取下一个节点时间作为当前节点时间
        if (modifiers.includes(">")) {
          time = time.plus({[nodeInfo.unit]: +nodeInfo.step});
        }
        // 如果包含"today"修饰符，则表示需要对今天时间进行特殊处理
        // 即：当节点时间大于当前时间（今天时刻），则根据标志做相应处理
        let today: string = modifiers.find(e => e.includes("today"));
        if (today) {
          let flag       = today.substring(5, 7);
          let formats    = today.substring(7).split("|");
          let expression = `yyyy-MM-dd ${formats[0]}`;
          let target     = DateTime.fromSQL(time.toFormat(expression));
          // 如果当前节点时间大于今天此刻
          if (target.valueOf() > now.valueOf()) {

            if (flag === "<<") {  // 如果包含"<<"标志，则表示强制取上一个节点时间作为当前节点时间
              time = time.plus({[nodeInfo.unit]: -nodeInfo.step});
            } else {   
              if(now.minute > 1){
                time = now.startOf('hour').plus({ hours: 1 });
              } else{
                time = now;
              }          // 否则取当前时间为当前节点时间
              
            }
            if (formats[1]) {     // 如果标志后面带有日期格式，则表示使用此格式，并丢弃#time后面的格式    
              format = formats[1];
            }

          }
        }
        if (modifiers.includes("seconds")) {      // 如果包含"seconds"修饰符，则表示取时间秒数
          if (format) time = DateTime.fromSQL(time.toFormat(format));
          time = time.valueOf() / 1000;
        } else if (modifiers.includes("mills")) { // 如果包含"mills"修饰符，则表示取时间毫秒数
          if (format) time = DateTime.fromSQL(time.toFormat(format));
          time = time.valueOf();
        }
      }
      // 如果时间没有取成数值，则对时间进行格式化
      value = time instanceof DateTime ? time.toFormat(format) : time;
      buf   = buf.replace(exec[0], String(value));
    }
  }
  return buf;
}


// 将图层标题的时间解析成yyyy-MM-dd HH:mm:ss格式
export function getFormatDate(pattern: string, nodeInfo: Visual.NodeInfo,resolveFormat='M月d日H时'): any {
  let now       = DateTime.fromMillis(Date.now());
  // let now       = DateTime.fromSQL("2022-11-24 06:00:00");
  let exec, buf = pattern;
  const arr:any = []
  while (exec = reg.exec(pattern)) {
    let items = exec[1].split("#");
    let value = get(nodeInfo, items[0]);
    if (items.length === 1) {           // 如果不是取得时间字段，则直接获取值
      buf = buf.replace(exec[0], value == null ? "" : String(value));
    } else if (items[0] === "time") {   // 如果取得是时间字段，则需要对时间进行处理（time后面必须跟随"#"）
      let time: DateTime | number = <DateTime>value;
      let modifiers: string[]     = items[1].split("@");
      let format                  = modifiers[0];
      if (modifiers.length > 0) {
        // 如果包含"<"修饰符，则表示取上一个节点时间作为当前节点时间
        if (modifiers.includes("<")) {
          time = time.plus({[nodeInfo.unit]: -nodeInfo.step});
        }
        // 如果包含">"修饰符，则表示取下一个节点时间作为当前节点时间
        if (modifiers.includes(">")) {
          time = time.plus({[nodeInfo.unit]: +nodeInfo.step});
        }
        // 如果包含"today"修饰符，则表示需要对今天时间进行特殊处理
        // 即：当节点时间大于当前时间（今天时刻），则根据标志做相应处理
        let today: string = modifiers.find(e => e.includes("today"));
        if (today) {
          let flag       = today.substring(5, 7);
          let formats    = today.substring(7).split("|");
          let expression = `yyyy-MM-dd ${formats[0]}`;
          let target     = DateTime.fromSQL(time.toFormat(expression));
          // 如果当前节点时间大于今天此刻
          if (target.valueOf() > now.valueOf()) {

            if (flag === "<<") {  // 如果包含"<<"标志，则表示强制取上一个节点时间作为当前节点时间
              time = time.plus({[nodeInfo.unit]: -nodeInfo.step});
            } else {   
              if(now.minute > 1){
                time = now.startOf('hour').plus({ hours: 1 });
              } else{
                time = now;
              }          // 否则取当前时间为当前节点时间
              
            }
            if (formats[1]) {     // 如果标志后面带有日期格式，则表示使用此格式，并丢弃#time后面的格式    
              format = formats[1];
            }

          }
        }
        if (modifiers.includes("seconds")) {      // 如果包含"seconds"修饰符，则表示取时间秒数
          if (format) time = DateTime.fromSQL(time.toFormat(format));
          time = time.valueOf() / 1000;
        } else if (modifiers.includes("mills")) { // 如果包含"mills"修饰符，则表示取时间毫秒数
          if (format) time = DateTime.fromSQL(time.toFormat(format));
          time = time.valueOf();
        }
      }
      // 如果时间没有取成数值，则对时间进行格式化
      value = time instanceof DateTime ? time.toFormat(format) : time;
      if(time instanceof DateTime){
         const isYear = value.includes('年')
         const tm = DateTime.fromFormat(value,isYear? format: resolveFormat)
         const tmRes = DateTime.fromMillis(tm.ts).toFormat(`${time.year}-MM-dd HH:00:00`)
         arr.push(tmRes)
      }
      buf   = buf.replace(exec[0], String(value));
    }
  }
  return arr;
}



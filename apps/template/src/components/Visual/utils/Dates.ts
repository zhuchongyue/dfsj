import {DateTime} from "luxon";
const Lookup = {
  servertime: Date.now().valueOf()
}

const FULL_TIME = "yyyy-MM-dd HH:mm:ss";

/**
 * 简易的，获取指定日期的字符串辅助类。
 */
export default class Dates {
  /**
   * 获取指定步长的日期字符串。
   * @param step 步长，负数为减，正数为加
   * @param units 时间单位
   * @param pattern 日期格式
   * @return {string} 某个日期的特定格式日期字符串
   */
  static specify(step: number = 0, units: string = 'days', pattern: string = FULL_TIME): string {
    if (step === 0) {
      return DateTime.fromMillis(Lookup.servertime).toFormat(pattern);
    }
    return DateTime.fromMillis(Lookup.servertime).plus({[units]: step}).toFormat(pattern);
  }

  //格式化
  static dateFormat(date: string | Date | number, format = 'yyyy-MM-dd HH:mm:ss') {
    if (typeof (date) == 'number') {
      return DateTime.fromMillis(date).toFormat(format)
    } else if (typeof (date) == 'string') {
      return DateTime.fromJSDate(new Date(date)).toFormat(format)
    } else if (date instanceof Date) {
      return DateTime.fromJSDate(date).toFormat(format)
    }

  }


  /**
   * 根据提供的日期值，格式化指定格式的日期字符串
   * @param value 日期值，可以是日期对象，日期字符串，如果为null，则为当前日期
   * @param pattern 日期格式
   * @return 格式化后的日期字符串
   */
  static stringify(value?, pattern: string = FULL_TIME): string {
    let date;
    if (value instanceof Date) {
      date = DateTime.fromJSDate(value);
    } else if (value instanceof DateTime) {
      date = value;
    } else if (typeof value === "string") {
      date = DateTime.fromSQL(value);
    } else if (value == null) {
      date = DateTime.fromMillis(Lookup.servertime);
    }

    return date.toFormat(pattern);
  }


  // 获取指定月份的开始结束时间
  static getTargetMonthRange(dateString=null){
    let firstDate = new Date(dateString);
    let startDate = firstDate.getFullYear()+"-"+((firstDate.getMonth()+1)<10?"0":"")+(firstDate.getMonth()+1)+"-"+"01";

    let date=new Date(dateString);
    let currentMonth=date.getMonth();
    let nextMonth=++currentMonth;
    let nextMonthFirstDay:any=new Date(date.getFullYear(),nextMonth,1);
    let oneDay=1000*60*60*24;
    let lastDate =  new Date(nextMonthFirstDay-oneDay);
    let  endDate = lastDate.getFullYear()+"-"+((lastDate.getMonth()+1)<10?"0":"")+(lastDate.getMonth()+1)+"-"+(lastDate.getDate()<10?"0":"")+lastDate.getDate();

    return [startDate,endDate]

}

  // 获取指定月份的天数
static getMonthDaysFn = (year, month)=>{
  // let days = new Date(year, month + 1, 0).getDate()
  // return days
  if(typeof(year) == 'string'){
    year = parseInt(year)
  }

  if(typeof(month) == 'string'){
    month = parseInt(month)
  }

  let days = [31,28,31,30,31,30,31,31,30,31,30,31]
  if ( (year % 4 ===0) && (year % 100 !==0 || year % 400 ===0) ) {
        days[1] = 29
  }
　　return days[month-1]
}


static DateTime = DateTime
/**
 * 获取指定时间 前后的一个时间点
 * @param date 开始日期
 * @param num  结束日期于开始日期之差
 * @param unit 单位  hous  days   years
 * @param format 格式
 */
static  getTargetDate(date = null,num = 0,unit = 'days',format = 'yyyy-MM-dd'){

  const timeObj = date?DateTime.fromISO(date):DateTime.now()
  let plusObj = {}
  plusObj[unit] = num
  return timeObj.plus(plusObj).toFormat(format)
}
}
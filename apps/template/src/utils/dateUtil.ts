/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';
const SHORT_FORMAT = 'YY/MM/DD HH:mm';

export function formatToDateTime(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_TIME_FORMAT
): string {
  return dayjs(date).format(format);
}

export function formatToDate(
  date: dayjs.Dayjs | undefined = undefined,
  format = DATE_FORMAT
): string {
  return dayjs(date).format(format);
}

export const dateUtil = dayjs;

export { SHORT_FORMAT, DATE_FORMAT, DATE_TIME_FORMAT };

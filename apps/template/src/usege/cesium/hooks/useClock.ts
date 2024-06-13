import * as ECCesium from '@dfsj/cesium';
import {getGis} from '@/core/GisCache.ts';
import dayjs from 'dayjs';

const Cesium = ECCesium.getLib('Cesium');

/**
 * 设置时间  可以实现光照效果
 */

export function useClock() {
  /**
   *
   * @param startTime  时钟的开始时间
   * @param currentTime  当前时间
   * @param stopTime  时钟的停止时间
   * @param multiplier 速度：确定调用 Clock#tick 时提前多少时间，负值允许向后推进
   * @param clockRange 循环类型：时间范围： 0:UNBOUNDED,1:CLAMPED,2:LOOP_STOP
   */
  const setClock = ({
    startTime = '2023/11/23 00:00:00',
    currentTime = '2023/11/23 10:00:00',
    stopTime = '2023/11/23 23:59:59',
    multiplier = 1,
    clockRange = 0,
  }) => {
    const clock = getGis().clock;
    if (!clock) return;
    clock.startTime = Cesium?.JulianDate.fromDate(dayjs(startTime).add(8, 'hour')?.$d);
    clock.currentTime = Cesium?.JulianDate.fromDate(dayjs(currentTime).add(8, 'hour')?.$d);
    clock.stopTime = Cesium?.JulianDate.fromDate(dayjs(stopTime).add(8, 'hour')?.$d);
  };
  return { setClock };
}

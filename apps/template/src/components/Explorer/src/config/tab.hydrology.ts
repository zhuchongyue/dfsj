import dayjs from 'dayjs';
import {defineAsyncComponent} from 'vue';

import {findRiverZqrl, getCrossSection, getRiverRealPro,} from '/@/api/common';
import {findRiverStation} from "@/components/Explorer";

export default {
  renders: [
    {
      name: 'hcross',
      label: '河道断面',
      order: 1,
      content: defineAsyncComponent(
        () => import('../components/Hydrology/CrossSection.vue')
      ),
      options: {
        loader: ({ target, condition }) => {
          const params = {
            stcd: target?.stcd,
          };
          return getCrossSection(params);
        },
        condition: () => ({}),
      },
    },
    {
      name: 'real',
      label: '实时数据',
      order: 2,
      content: defineAsyncComponent(
        () => import('../components/Hydrology/Real.vue')
      ),
      options: {
        appendable: 3,
        loader: ({ target, condition }) => {
          // 设置请求时间
          let start = `${condition.date[0]}`;
          let end = `${condition.date[1]}`;
          start = dayjs(start).format('YYYY-MM-DD 00:00:00');
          end = dayjs(end).format('YYYY-MM-DD 23:59:59');
          const params = { stcd: target.stcd, start, end };
          return getRiverRealPro(params);
        },
        condition: () => ({
          date: [dayjs().subtract(3, 'day'), dayjs()],
        }),
        control: {},
      },
    },
    // {
    //   name: 'fore',
    //   label: '来水预报',
    //   order: 3,
    //   content: defineAsyncComponent(
    //     () => import('../components/Hydrology/Fore.vue')
    //   ),
    //   options: {
    //     loader: ({ target, condition }) => {
    //       const params = {
    //         topoid: target?.eacId,
    //         start: condition?.date?.[0],
    //         end: condition?.date?.[1],
    //       };
    //       return getForecastLine(params);
    //     },
    //     condition: () => ({
    //       date: [
    //         dayjs().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'),
    //         dayjs().add(3, 'day').format('YYYY-MM-DD 23:59:59'),
    //       ],
    //     }),
    //   },
    // },
    {
      name: 'base',
      label: '基础信息',
      order: 4,
      content: defineAsyncComponent(
        () => import('../components/Hydrology/BaseInfo/BaseInfo.vue')
      ),
      options: {
        //@ts-ignore
        loader: ({ target }) => {
          const params = {
            stcd: target?.stcd ?? target?.mocd,
          };
          return findRiverStation(params);
        },
      },
    },
    {
      name: 'stageflow',
      label: '水位流量关系',
      order: 5,
      content: defineAsyncComponent(
        () => import('../components/Hydrology/Stageflow.vue')
      ),
      options: {
        loader: ({ target, condition }) => {
          const params = {
            stcd: target?.stcd,
          };
          return findRiverZqrl(params);
        },
        condition: () => ({}),
        control: {
          date: { range: false, label: '开始时间', precision: 'datetime' },
        },
      },
    },
  ],
};

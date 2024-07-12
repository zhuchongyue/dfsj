import dayjs from 'dayjs';
import {defineAsyncComponent} from 'vue';
import {
    findRsvrZvarl,
    getDrainageByStcd,
    getDrainageCurves,
    getDrainageHeightByDnid,
    getRsvrRealPro,
} from '/@/api/common';
import {findRsvrDam, findRsvrStation} from "@/components/Explorer";
import {defHttp} from "@/utils/http/axios";

export default {
  renders: [
    {
      name: 'dam',
      label: '大坝示意图',
      order: 1,
      content: defineAsyncComponent(
        () => import('../components/Reservoir/DamSchematic.vue')
      ),
      options: {
        // 曲线加载
        //@ts-ignore
        loader: ({ target }) => {
          console.log('/////请求大坝示意图', target);
          const params = {
            stcd: target?.stcd ?? target?.mocd,
          };
          return findRsvrDam(params);
        },
      },
    },
    {
      name: 'real',
      label: '实时数据',
      order: 2,
      content: defineAsyncComponent(
        () => import('../components/Reservoir/Real.vue')
      ),
      options: {
        appendable: 3,
        //@ts-ignore
        loader: ({ target, condition }) => {
          // 设置请求时间
          let start = `${condition.date[0]}`;
          let end = `${condition.date[1]}`;
          start = dayjs(start).format('YYYY-MM-DD 00:00:00');
          end = dayjs(end).format('YYYY-MM-DD 23:59:59');
          const params = { stcd: target.stcd, start, end };
          return getRsvrRealPro(params);
        },
        condition: () => ({
          date: [dayjs().subtract(3, 'day'), dayjs()],
        }),
        control: {},
        // attache: {
        //     visible: false,
        //     content: defineAsyncComponent(() => import('#/renderer/DetailsRenderer')),
        //     options: {
        //         editable: false,
        //         loader: ({ target }) => {
        //             return Lookup.store.api.from('renderer.base', { stcd: target.stcd })
        //         },
        //         content: [{ content: simple }],
        //     },
        // },
      },
    },
    {
      name: 'three',
      label: '三类责任人',
      order: 3,
      content: defineAsyncComponent(
        () => import('../components/Reservoir/Responsible.vue')
      ),
      options: {
        // 加载三类责任人
        //@ts-ignore
        loader: ({ target }) => {
          const params = {
            stcd: target?.stcd ?? target?.mocd,
            motype: target.motype,
          };
          return defHttp.post({
            url: '/station-service/station/findCommunicationByStcd',
            params,
          });
          // : findCommunicationByStcd(params);
        },
      },
    },
    // {
    //   name: 'fore',
    //   label: '来水预报',
    //   order: 4,
    //   content: defineAsyncComponent(
    //     () => import('../components/Reservoir/Fore.vue')
    //   ),
    //   options: {
    //     loader: ({ target, condition }) => {
    //       const params = {
    //         topoid: target?.eacId,
    //         start: condition?.date?.[0],
    //         end: condition?.date?.[1],
    //       };
    //       if (!params.topoid) return Promise.resolve({});
    //       return getForecastLine(params);
    //     },
    //     condition: () => ({
    //       date: [
    //         dayjs().subtract(7, 'day').format('YYYY-MM-DD 00:00:00'),
    //         dayjs().add(3, 'day').format('YYYY-MM-DD 23:59:59'),
    //       ],
    //     }),
    //     control: {
    //       date: { range: false, label: '开始时间', precision: 'datetime' },
    //     },
    //   },
    // },
    {
      name: 'base',
      label: '基础信息',
      order: 5,
      content: defineAsyncComponent(
        () => import('@/components/Explorer/src/components/Reservoir/BaseInfo/BaseInfo.vue')
      ),
      options: {
        //@ts-ignore
        loader: ({ target }) => {
          const params = {
            stcd: target?.stcd ?? target?.mocd,
          };
          return findRsvrStation(params);
        },
      },
    },
    {
      name: 'capacity',
      order: 6,
      label: '库容曲线',
      content: defineAsyncComponent(
        () => import('../components/Reservoir/Capacity.vue')
      ),
      options: {
        // 曲线加载
        //@ts-ignore
        loader: ({ target }) => {
          const params = {
            stcd: target?.stcd ?? target?.mocd,
            // stcd: 80711700,
            // stcd: 60800520,
          };
          return findRsvrZvarl(params);
        },
      },
    },
    {
      name: 'discharge',
      order: 7,
      label: '泄洪曲线',
      // disable: true,
      content: defineAsyncComponent(
        () => import('../components/Reservoir/DrainageCurves.vue')
      ),
      options: {
        // 曲线加载
        //@ts-ignore
        loader: ({ target, condition }) => {
          console.log('target',target)
          const params = {
            stcd: target.stcd,
            dnid: condition.gate,
            heights: condition.apertures,
          };
          console.log('/////泄洪曲线', params);
          return getDrainageCurves(params);
        },
        control: {
          // 门
          gate: {
            keymap: {
              label: 'value',
              value: 'key',
            },
            //@ts-ignore
            source: (target) => {
              const params = { stcd: target?.stcd };
              return getDrainageByStcd(params);
            },
          },
          // 开度
          aperture: {
            keymap: {
              label: 'value',
              value: 'key',
            },
            //@ts-ignore
            source: (target, condition) => {
              const params = {
                stcd: target.stcd,
                dnid: condition.gate,
              };
              return getDrainageHeightByDnid(params);
            },
          },
        },
      },
    },
  ],
};

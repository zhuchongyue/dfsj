import {defineAsyncComponent} from 'vue';
import {deepMerge} from "@dfsj/utils";
import {AroundDefaultOptions} from "@/components/AroundQuery";
export default {
  renders: [
    {
      name: "around",
      label: "周边查询",
      order: 100,
      content: defineAsyncComponent(() => import("/@/components/AroundQuery/src/AroundQuery.vue")),
      options: deepMerge(AroundDefaultOptions,{
        condition: {radius: 1},
        control: {
          preset: {
            names: "radius",
            units: "Km",
            items: [
              {value: 1, label: "1km"},
              {value: 3, label: "3km"},
              {value: 5, label: "5km"},
              {value: 10, label: "10km"},
              {value: 20, label: "20km"},
            ],
          },
        },
      }),
      narrow:false
    },
  ],
}

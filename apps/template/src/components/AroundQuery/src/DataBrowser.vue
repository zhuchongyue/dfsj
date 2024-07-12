<script lang="ts" setup>
import {computed, ref, toRaw, unref, onMounted,shallowRef} from "vue";
import { Table } from '@dfsj/components';
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {useUserStore} from '/@/store/modules/user';
import {AroundQueryDataBrowserProps} from "@/components/AroundQuery/src/props.ts";
import {State} from "@dfsj/components";
const useStore = useUserStore();
const {prefixCls} = useDesign('component-data-browser-page');
const emits = defineEmits(["row:dblclick", "row:click", "export"]);
const props = defineProps(AroundQueryDataBrowserProps)
const source = shallowRef();
const dimensions = shallowRef(props.dimensions);
const pagination = shallowRef(props.pagination || {});
let keymap = null;

const stateful = new State();
function onQuery(page = 1) {
  console.log('page',page)
  Object.assign(pagination.value, {page});
  stateful.loading();
  props.loader
      .call(null, props.condition, pagination.value)
      .then(data => {
        console.log('data',data)
        keymap = data && "keymap" in data ? data.keymap : null;
        let rows = data && "source" in data ? data.source : data;
        let page = data && "pagination" in data ? data.pagination : null;
        let dims = data && "dimensions" in data ? data.dimensions : null;
        if (rows) source.value = rows;
        if (page) Object.assign(pagination.value, page);
        if (dims) dimensions.value = dims;
        stateful.completed(!rows?.length);
      })
      .catch(() => stateful.error());
}
onMounted(onQuery);

</script>
<template>
  <div :class="prefixCls">
<!--    <div class="h-full">-->
      <Table
          :height="'100%'"
          max-height="100%"
          :width="'100%'"
          show-action
          :columns="dimensions"
          :data="source"
          row-key="id"
          :pagination="{
            total:pagination.total,
            pageSize:pagination.size,
          }"
          @update:current-page="onQuery"
      >
      </Table>
    </div>
<!--  </div>-->
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-component-data-browser-page;
.#{$prefix-cls} {
  height: 100%;
  width: 100%;
  min-height: 0;
}
</style>
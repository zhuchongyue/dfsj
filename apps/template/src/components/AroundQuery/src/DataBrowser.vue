<script lang="ts" setup>
import {onMounted, shallowRef} from "vue";
import {State, Table} from '@dfsj/components';
import {useDesign} from "/@/hooks/web/useDesign.ts";
import {AroundQueryDataBrowserProps} from "@/components/AroundQuery/src/props.ts";

const {prefixCls} = useDesign('data-browser-page');
const emits = defineEmits(["row:dblclick", "row:click", "export"]);
const props = defineProps(AroundQueryDataBrowserProps)
const source = shallowRef();
const dimensions = shallowRef(props.dimensions);
const pagination = shallowRef(props.pagination || {});

const stateful = new State();

function onQuery(page = 1) {
  Object.assign(pagination.value, {page});
  stateful.loading();
  props.loader
      .call(null, props.condition, pagination.value)
      .then(data => {
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
</template>

<style lang="scss">
$prefix-cls: #{$namespace}-data-browser-page;
.#{$prefix-cls} {
  height: 100%;
  width: 100%;
  min-height: 0;
}
</style>
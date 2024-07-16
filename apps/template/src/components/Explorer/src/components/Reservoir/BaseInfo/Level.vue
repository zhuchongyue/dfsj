<script lang="ts" setup>
import {ref, reactive, toRaw, unref, toRefs} from "vue";
import {useDesign} from "@/hooks/web/useDesign.ts"
import {Table, TableColumn, Icon} from "@dfsj/components";
import {isEmpty} from "@dfsj/utils";
import {ElNotification} from "element-plus";
import {Action, compProps, updateStRsvrFsrB} from "@/components/Explorer";

const props = defineProps(compProps);
const {target} = toRefs(props)
const editable = ref(true)
const columns: TableColumn[] = [
  {
    type: 'index',
    label: '序号',
    align: 'center',
    field: '',
  },
  {
    label: '开始日月',
    field: 'bgmd',
    align: 'center',
  },
  {
    label: '结束日月',
    field: 'edmd',
    align: 'center',
  },
  {
    label: '汛限水位',
    field: 'fsltdz',
    align: 'center',
  },
  {
    label: '汛限库容',
    field: 'fsltdw',
    align: 'center',
  },
  {
    label: '汛期类别',
    field: 'fstp',
    align: 'center',
  },
  //@ts-ignore
  (function () {
    if (editable.value) {
      return {
        label: '操作',
        field: 'action',
        align: 'center',
      }
    }
    return null
  })(),
].filter(Boolean);
const {prefixCls} = useDesign('rsvr-level-page');
const dataList = ref(target.value.fsl ?? [])


function hasUnDef(col) {
  return col?.some((e) => {
    const {
      bgmd = '',
      edmd = '',
      fsltdz = '',
      fsltdw = '',
      fstp = '',
    } = e;
    return isEmpty(bgmd) &&
        isEmpty(edmd) &&
        isEmpty(fsltdz) &&
        isEmpty(fsltdw) &&
        isEmpty(fstp)
  });
}

function handleDelCol(row, index) {
  if (dataList.value.length) dataList.value.splice(index, 1);
}

function addRowHandle() {
  //检查是否有空行
  const rows = toRaw(unref(dataList));
  const can = hasUnDef(rows);
  console.log('has', can)
  if (can) {
    return ElNotification({
      title: '表单提示',
      message: '有空行,请填写完整后在添加!',
      type: 'warning',
      duration: 1000,
    });
  }
  const emptyCol = {
    bgmd: '',
    edmd: null,
    fsltdz: null,
    fsltdw: null,
    fstp: null,
  };
  dataList.value.push(emptyCol);
}

function onSave() {
  const rows = toRaw(unref(dataList));
  const stcd = target.value?.stcd
  rows.forEach((e)=>e.stcd = stcd)
  const params = {
    datas: rows,
    stcd: stcd
  }
  updateStRsvrFsrB(params).then(() => {
    props?.refresh({target:target.value})
  })
}

</script>
<template>
  <div :class="[`${prefixCls} relative box-border h-full w-full`,{editable:editable}]">
    <div :class="`${prefixCls}__plus`" v-if="editable">
      <el-button type="primary" circle @click.stop="addRowHandle">
        <template #icon>
          <Icon :icon="'mdi:plus'"/>
        </template>
      </el-button>
    </div>
    <Table
        :height="'100%'"
        :header-align="'center'"
        stripe
        :columns="columns"
        :data="dataList"
        :pagination="null"
    >
      <template #bgmd="{row}">
        <el-input v-if="editable" style="width: 90%" v-model="row.bgmd"></el-input>
        <span v-else>{{ row.bgmd }}</span>
      </template>
      <template #edmd="{row}">
        <el-input v-if="editable" style="width: 90%" v-model="row.edmd"></el-input>
        <span v-else>{{ row.edmd }}</span>
      </template>
      <template #fsltdz="{row}">
        <el-input v-if="editable" style="width: 90%" v-model="row.fsltdz"></el-input>
        <span v-else>{{ row.fsltdz }}</span>
      </template>
      <template #fsltdw="{row}">
        <el-input v-if="editable" style="width: 90%" v-model="row.fsltdw"></el-input>
        <span v-else>{{ row.fsltdw }}</span>
      </template>
      <template #fstp="{row}">
        <el-input v-if="editable" style="width: 90%" v-model="row.fstp"></el-input>
        <span v-else>{{ row.fstp }}</span>
      </template>

      <template #action="{ row, index }" v-if="editable">
        <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon-color="#626AEF"
            title="确定删除?"
            @confirm="() => handleDelCol(row, index)"
        >
          <template #reference>
            <Icon class="cursor-pointer" :icon="'mdi:delete'" color="red"/>
          </template>
        </el-popconfirm>
      </template>
    </Table>
    <div :class="`${prefixCls}__save absolute`" v-if="editable">
      <el-button type="success" circle size="large" @click="onSave">
        <template #icon>
          <Icon :size="26" icon="mdi:content-save-check"/>
        </template>
      </el-button>
    </div>
  </div>
</template>
<style lang="scss">
$prefix-cls: #{$namespace}-rsvr-level-page;
.#{$prefix-cls} {
  min-height: 100%;

  &.editable {
    display: grid;
    grid-template-rows: 40px 1fr;
  }

  &__save {
    bottom: 10%;
    right: 10%;
    z-index: 1000;
  }

  &__plus {
    display: flex;
    justify-content: end;
    align-items: center;
  }
}
</style>
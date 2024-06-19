<script setup lang="tsx">
import {useUserStore} from "/@/store/modules/user.ts";
import {computed, reactive} from "vue";
import {Form, FormSchema, Table, TableColumn, useForm, useTable} from "@dfsj/components";
import {findAdcdByPadcd} from "/@/usege/components/api.ts";
import {deleteUserApi, getRoleListApi, getUserListApi} from "/@/api/system.ts";
import {unref,ref} from "vue";
import {useRootStoreWithOut} from "/@/store/root.ts";
import EditUser from "/@/views/system/users/components/EditUser.vue";

const userStore = useUserStore();
const user = computed(() => userStore.userInfo);
const {formRegister, formMethods} = useForm();
const {
  setProps,
  delSchema,
  addSchema,
  setValues,
  setSchema,
  getComponentExpose,
  getFormItemExpose,
  getElFormExpose,
  getFormData
} = formMethods;
function handleSearch() {
  
  
}
function handleReset() {
  
}
const schema = reactive<FormSchema[]>([
  {
    field: 'roleId',
    label: '用户角色',
    component: 'RadioGroup',
    componentProps: {
      props: {
        value: 'roleId',
        label: 'roleName',
      },
    },
    colProps: {
      span: 16,
    },
    optionApi: async () => {
      const res = await getRoleListApi();
      console.log('res',res)
      return res;
    },
  },
  {
    field: 'keyword',
    label: '关键字',
    component: 'Input',
    formItemProps: {},
    colProps: {
      span: 4,
    },
  },
  {
    field: 'register',
    colProps: {
      span: 3
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
              <>
                <div class="w-[100%]">
                  <el-button type="primary" onClick={handleSearch}> 查询</el-button>
                  <el-button type="success" class="ml-2"> 导出</el-button>
              </div>
              </>
        )
        }
      }
    }
  }

]);



const {tableRegister, tableMethods, tableState} = useTable({
  fetchDataApi: async () => {
    const {currentPage, pageSize} = tableState;
    const res = await getUserListApi({
      // page: {pageNow: unref(currentPage), pageSize: unref(pageSize)},
      pageNum: unref(currentPage),
      pageSize: unref(pageSize),
      // adcd: user.value?.adcd,
    });
    console.log('res', res);
    return {
      list: res?.source ?? [],
      total: res?.pagination.total ?? 0,
    };
  },
});
const { getList, getElTableExpose, delList } = tableMethods
const {loading, dataList, total, currentPage, pageSize} = tableState;
const columns: TableColumn[] = [
  {
    field: 'selection',
    type: 'selection',
    align: 'center',
  },
  {
    type: 'index',
    label: '序号',
    align: 'center',
    field: '',
  },
  {
    field: 'userName',
    label: '用户名',
    align: 'center',
  },
  {
    field: 'realName',
    label: '姓名',
    align: 'center',
  },
  {
    field: 'genderStr',
    label: '性别',
    align: 'center',
  },
  {
    field: 'deptName',
    label: '所在机构',
    align: 'center',
  },
  {
    label: '角色',
    field: 'rolesStr',
  },
  {
    label: '邮箱',
    field: 'email',
    minWidth: '110px',
  },
  {
    label: '手机',
    field: 'phone',
    minWidth: '110px',
  },
  {
    label: '固定电话',
    field: 'tel',
    minWidth: '110px',
  },
  {
    label: '用户状态',
    field: 'lockFlag',
    minWidth: '70px',
  },
  {
    label: '操作',
    field: 'action',
  },
];


function handleAdd() {
  useRootStoreWithOut().window.open({
    id: 'edit-user',
    title: '新增用户',
    sizes: ['40rem', '40rem'],
    content: () => import('./components/EditUser.vue'),
    // titleAfter: titleAfter,
    footer:false,
    props: {
      responseId: 'xxx',
    },
  });
}
const delLoading = ref(false)
const ids = ref<string[]>([])

const handleDel = async (row?: any) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
      ? [row.id]
      : elTableExpose?.getSelectionRows().map((v: any) => v.id) || []
  delLoading.value = true

  await deleteUserApi({idList: unref(ids)}).finally(() => {
    delLoading.value = false
  })
}
</script>

<template>
  <div>
    <Form
        label-position="left"
        :isCustom="false"
        ref="formRef"
        :is-col="true"
        @register="formRegister"
        :schema="schema"
        label-width="auto"
    />
    <div>
      <el-button type="primary" @click.stop="handleAdd"> 新增</el-button>
      <el-button type="success" @click.stop="handleDel"> 删除</el-button>
    </div>
    <div>
      <Table
          :height="'100%'"
          max-height="100%"
          v-model:pageSize="pageSize"
          v-model:currentPage="currentPage"
          showAction
          :header-align="'center'"
          stripe
          :columns="columns"
          :data="dataList"
          :loading="loading"
          :pagination=" {
                total: total,
              }
        "
          @register="tableRegister"
          :defaultSort="{ prop: 'display_time', order: 'descending' }"
      >
      </Table>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
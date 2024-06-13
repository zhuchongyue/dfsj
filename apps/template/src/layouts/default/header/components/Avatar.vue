<template>
  <el-dropdown trigger="click">
     <div class="avatar-username flex flex-col items-center ">
       <div class="avatar">
    <img src="/images/avatar.svg" alt="avatar" />
       </div>
       <span class="username mt-2  text-white">{{ username }}</span>
     </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleAccount">
          <Icon  icon="mdi:user"/>
          个人信息
        </el-dropdown-item>
        <el-dropdown-item @click="handleEdit">
          <Icon  icon="mdi:book-edit"/>
          修改密码
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          <Icon  icon="mdi:location-exit"/>
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- infoDialog -->
  <InfoDialog ref="infoRef"></InfoDialog>
  <!-- passwordDialog -->
  <PasswordDialog ref="passwordRef"></PasswordDialog>
</template>

<script setup lang="ts">
import {computed, ref,markRaw,defineAsyncComponent} from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import InfoDialog from "./InfoDialog.vue";
import PasswordDialog from "./PasswordDialog.vue";
import {Icon} from "@dfsj/components";
import {PageEnum} from "/@/enums/pageEnum";
import {useUserStore} from "/@/store/modules/user";
// import {addDialog} from "/@/components/Dialog";
const userStore = useUserStore();
const username = computed(() => userStore.getUserInfo?.realName);
const router = useRouter();

// 退出登录
const logout = () => {
  userStore.confirmLoginOut()
};

// 打开修改密码和个人信息弹窗
const infoRef = ref<InstanceType<typeof InfoDialog> | null>(null);
const passwordRef = ref<InstanceType<typeof PasswordDialog> | null>(null);
const openDialog = (ref: string) => {
  // if (ref == "infoRef")
  //   // infoRef.value?.openDialog();
  // // if (ref == "passwordRef") passwordRef.value?.openDialog();
  // if (ref == "passwordRef"){

};
function handleAccount() {
  // addDialog({
  //   title: "个人信息",
  //   width: '30rem',
  //   height: '500px',
  //   // contentRenderer: () => (ReportForm)//import("./components/reportForm/index.vue")
  //   contentRenderer:markRaw(defineAsyncComponent(() => import("/@/views/flood/system/userInfo/components/BasicAccount.vue"))),
  //   // hideFooter: true
  // })

}

function handleEdit() {
  // addDialog({
  //   title: "修改密码",
  //   width: '30rem',
  //   height: '350px',
  //   // contentRenderer: () => (ReportForm)//import("./components/reportForm/index.vue")
  //   contentRenderer:markRaw(defineAsyncComponent(() => import("/@/views/flood/system/userInfo/components/changPsw.vue"))),
  //   // hideFooter: true
  // })

}
</script>

<style scoped lang="scss">
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>

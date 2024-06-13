<template>
   <div :class="prefixCls">
     <div :class="`${prefixCls}__entry`">
       <div :class="`${prefixCls}__header`">
<!--         <img src="/images/avatar.svg" alt="avatar" />-->
         <img src="/images/avatar.svg" :class="`${prefixCls}__header-img`"/>
         <p :class="`${prefixCls}__header-name`">
           {{ getRealName }}
         </p>
       </div>
       <el-form
           ref="ruleFormRef"
           :model="ruleForm"
           :rules="rules" >
         <el-form-item label="锁屏密码" prop="password">
           <el-input placeholder="请输入锁屏密码" v-model="ruleForm.password"/>
         </el-form-item>
       </el-form>


       <div :class="`${prefixCls}__footer`">
         <el-button type="primary" block class="mt-2" @click="handleLock">
           {{ t('layout.header.lockScreenBtn') }}
         </el-button>
       </div>
     </div>
   </div>
</template>
<script lang="ts">
import {defineComponent, computed, reactive,ref} from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import {useI18n} from '/@/hooks/web/useI18n';
import {useDesign} from '/@/hooks/web/useDesign';
import {useUserStore} from '/@/store/modules/user';
import {useLockStore} from '/@/store/modules/lock';
import headerImg from '/@/assets/images/header.jpg';
import {closeAllDialog} from "/@/components/Dialog";
export default defineComponent({
  name: 'LockModal',
  setup() {
    const {t} = useI18n();
    const {prefixCls} = useDesign('header-lock-modal');
    const userStore = useUserStore();
    const lockStore = useLockStore();
    const ruleForm = reactive({
      password: null
    })
    interface RuleForm {
      password: string
    }
    const ruleFormRef = ref<FormInstance>()
    const rules = reactive<FormRules<RuleForm>>({
      password: [
        { required: true, message: '请输入锁屏密码', trigger: 'blur' },
      ],
    })
    const getRealName = computed(() => userStore.getUserInfo?.realName);
    async function handleLock() {
      if (!ruleFormRef.value) return
      await ruleFormRef.value.validate(async (valid, fields) => {
        console.log('valid',valid,)
        if (valid) {
          lockStore.setLockInfo({
            isLock: true,
            pwd: ruleForm.password,
          });
          closeAllDialog()
          await ruleFormRef.value?.resetFields();
        } else {
          console.log('error submit!', fields)
        }
      })
    }

    const avatar = computed(() => {
      const {avatar} = userStore.getUserInfo;
      return avatar || headerImg;
    });

    return {
      t,
      prefixCls,
      getRealName,
      handleLock,
      avatar,
      ruleForm,
      ruleFormRef,
      rules,

    };
  },
});
</script>
<style lang="scss">
$prefix-cls: #{$namespace}-header-lock-modal;

.#{$prefix-cls} {
  &__entry {
    position: relative;
    //height: 240px;
    padding: 130px 30px 30px 30px;
    border-radius: 10px;
  }

  &__header {
    position: absolute;
    top: 0;
    left: calc(50% - 45px);
    width: auto;
    text-align: center;

    &-img {
      width: 70px;
      border-radius: 50%;
    }

    &-name {
      margin-top: 5px;
    }
  }

  &__footer {
    text-align: center;
    width: 100%;
    button{
      width: 100%;
    }
  }
}
</style>

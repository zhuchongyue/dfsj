<script lang="ts" setup>
import {computed, onBeforeMount, toRaw, unref} from 'vue';
import {usePermissionStore} from "/@/store/modules/permission";
import {SvgIcon} from '@dfsj/components';
import {ROUTE_MAPPING} from '/@/router/constant';
import {Menu} from "/@/router/types.ts";
import {useMenuStore, useMenuStoreWithOut} from "/@/store/modules/menu.ts";
import {useRouter} from "vue-router";
import {getRawRoute} from "/@/utils/route.ts";
import {findNode} from "@dfsj/utils";

const permissionStore = usePermissionStore();
const menus = computed(() => permissionStore.getBackMenuList ?? []);
const menuStore = useMenuStore();
const router = useRouter()

function handler(menuItem: Menu) {
  if (menuItem.name == menuStore.primary?.name) return;
  useMenuStoreWithOut().primary = menuItem;
}


onBeforeMount(() => {
  const {name, meta} = getRawRoute(unref(router.currentRoute));
  const node = findNode(toRaw(unref(menus)), (item: any) => item.name == name, {
    children: 'subs'
  })
  if (node) useMenuStoreWithOut().primary = node;
})


</script>
<template>
  <div class="sys-nav-wrap flex items-center justify-end h-full">
    <div
        v-for="(item, i) in menus"
        :key="i"
        class="router-item h-full"
        type=""
        :underline="false"
        @click="() => handler(item)"
    >
      <router-link
          exact
          active-class="active"
          class="normal flex flex-col items-center h-full justify-center relative"
          :to="ROUTE_MAPPING?.[item?.name]?.path ?? '/'"
      >
        <SvgIcon :size="36" :name="ROUTE_MAPPING?.[item?.name]?.icon"/>
        <span>   {{ item?.label || item?.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
.sys-nav-wrap {
  font-size: 16px;

  .router-item {
    margin-left: 10px;

    .span {
      font-size: 16px;
    }

    .normal {
      letter-spacing: 1px;
      text-decoration: none;
      color: #ffffff;
      padding: 0 10px;
      transition: opacity 0.15s ease-in-out;

      &:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: #fff;
        opacity: 0;
        transition: opacity 0.15s ease-in-out;
      }

      &:hover {
        &:before {
          opacity: 0.2;
          transition: opacity 0.15s ease-in-out;
        }
      }
    }

    .active {
      &:before {
        opacity: 0.2;
        transition: opacity 0.15s ease-in-out;
      }
    }
  }
}
</style>

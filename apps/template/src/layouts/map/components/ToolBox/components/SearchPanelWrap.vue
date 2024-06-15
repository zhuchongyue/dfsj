<script lang="ts" setup name="PanelWrap">
import {onBeforeUnmount, onMounted, h, resolveComponent, ref, watch} from "vue";
import {Icon} from "@dfsj/components";
import Constant from "/@/layouts/map/components/ToolBox/config/constant";
import {doSearch} from "/@/api/common";
import {useUserStore} from "/@/store/modules/user";
import {useDebounceFn ,useRequest} from "@dfsj/hooks";
// import {useSearchLocation} from "/@/layouts/map/components/ToolBox/hooks/useSearchLocation";

// const dataSource = ref(searchMock)

const keyWord  =ref(null)
const suffixIcon = () => {
  return h(Icon, {
    icon: 'mdi:magnify'
  })
}

const useStore = useUserStore()
/** 全局搜索*/
const {run, data:dataSource} = useRequest(() => {
  const params = {
    adcd:useStore.getUserInfo?.adcd,
    word:keyWord.value
  }
  return doSearch(params)
}, {
  manual: true
})


const {run: debounceDoSearch} = useDebounceFn(run, 500)

watch(()=>keyWord.value , (value, oldValue, onCleanup)=>{
  //如果存在就执行全文搜索  反之就是置空不执行搜索
  if (value){
    debounceDoSearch()
  }else{
    dataSource.value = []
  }
})


onMounted(() => {
  // useLeftTrue()
})
onBeforeUnmount(() => {
  clear()
})

// const  {  create } = useSearchLocation()
const handleOnSelect = (item) => {
  // create(item)
}

const clear = ()=>{

}
</script>

<!--左侧面板-->
<template>
        <div class="search-result-wrap" v-if="dataSource?.length">
          <div
              @click="handleOnSelect(item)"
              v-for="(item,index) in dataSource" :key="item.doc + index"
              :class="['result-item' , index % 2 == 0 ?  'even':'odd ']"
          >
            <div class="item-top">
              <span class="name">{{index+1}}--{{item?.archive?.name}} </span>
              <span class="type">{{Constant[item?.archive?.motype]}}</span>
            </div>
            <div class="item-desc">
              <span class="summary">{{item?.archive?.summary}}</span>
            </div>
          </div>
        </div>
   <div class="search-form">
     <el-input
         clearable
         v-model="keyWord"
         :debounce="100"
         placeholder="请输入关键字"
         :suffix-icon="suffixIcon"
         @clear="clear"
         outlined>
     </el-input>
   </div>
</template>

<style lang="scss">
.search-form{
  margin-top: 5px;
  border-radius: 4px;
}
.search-result-wrap {
  max-height: 400px;
  max-width: 320px;
  background: white;
  overflow-y: scroll;
  transition: all 1s ease;
  border-radius: 4px;
  filter: drop-shadow(2px 4px 6px  rgba(0, 0, 0, 0.2));
  .result-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    height: 70px;
    //color: $font-dk-2;
    padding: 0 16px;
    justify-content: center;
    line-height: 14px;
    cursor: pointer;

    .item-top {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .item-desc {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      margin-top: 10px;

      .summary {
        display: inline-block;
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #9E9E9E;
      }
    }

  }

  .even {
    background: linear-gradient(0deg, #F6F6F6, #F6F6F6), #FFFFFF;
  }

  .odd {
    background: white;
  }
}
</style>
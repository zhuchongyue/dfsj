# useCopyToClipboard

一个用来管理复制粘贴文本的hook

## 使用Demo

```vue
<template>
  <div class="hello" style="display:flex;align-items:flex-start;">
    <input placeholder="请输入" v-model:value="value" />
    <button type="primary" @click="handleCopy"> Copy </button>
  </div>
</template>

<script lang="ts">
import { useCopyToClipboard } from "@dfsj/hooks";

export default {
  
  setup() {
    const valueRef = ref(''); 
    const { clipboardRef, copiedRef } = useCopyToClipboard();

    function handleCopy() {
      const value = unref(valueRef);
      if (!value) { 
        return;
      }
      clipboardRef.value = value;
      if (unref(copiedRef)) { 
      }
    }
    return { handleCopy, value: valueRef };
  },
};
</script>
```

useCopyToClipboard接受一个初始的字符。 返回的isSuccessRef是否成功.

````

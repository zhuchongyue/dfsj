# useRefs

储存一个数组ref的Hook 。

## 使用Demo

```vue
<template>
  <div class="hello">
    <button v-for="(item,index) in buttons"
                 :key="item.id"
                 :name="item.id">
      <span :is="item.content"
                 :ref="setRefs(index)"
                 :tab="item"/>
    </button>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';  

export default {
  
  setup() {
    const [refs, setRefs] = useRefs();

    return {
      setRefs
    };
  },
};
</script>
```

usQRCide接受一个静态url，也可以是一个被Ref包裹的url，当Ref值发生变化时，二维码会跟随内容进行变化。

## Api

```
type Text = Ref<string> | string;
interface useQRCodeOptions {
    onRenderingStart?: (qrCodeOptions: any) => void;
    onRenderingEnd?: (qrCodeOptions: any, dataURL: string) => void;
    [key: string]: any;
}
const useQRCode: (text: Text, options?: useQRCodeOptions | undefined) => Ref<string | undefined>;
```

### Params

| 参数      | 说明                 | 类型                        | 默认值 |
|:--------|:-------------------|:--------------------------|:----|
| text    | 需要生成二维码的url或text	 | `string` \| `Ref<string>` | -   |
| options | 二维码配置项	           | Options                   | -   |

### Options

Options配置项可以参考<a href="https://github.com/ushelp/EasyQRCodeJS#qrcode-api">EasyQRCodeJS</a>
useQRCode的底层是使用了EasyQRCodeJS来作为二维码的实现。

### Result

| 参数     | 说明              | 类型     |
|:-------|:----------------|:-------|
| state	 | base64格式的二维码图片	 | string |

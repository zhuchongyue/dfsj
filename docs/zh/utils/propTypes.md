# props类型定义
:::tip
[VueTypes](https://dwightjack.github.io/vue-types/)是一个针对Vue.js的可配置道具验证器集合，灵感来自React的prop-types。
:::
## useage
```ts
import {propTypes} from '@dfsj/utils'

export default {
  props: {
    id: propTypes.number.def(10),
    name: propTypes.string.isRequired,
    age: propTypes.integer,
    nationality: propTypes.string,
  }, 
}
```
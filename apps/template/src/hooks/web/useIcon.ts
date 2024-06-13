import { h } from 'vue'
import type { VNode } from 'vue'
import { Icon, IconTypes } from '@dfsj/components'

export const useIcon = (props: IconTypes): VNode => {
  return h(Icon, props)
}

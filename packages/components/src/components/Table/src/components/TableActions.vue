<script lang="tsx">
import {defineComponent, PropType, ref, unref} from 'vue';
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ComponentSize } from 'element-plus'
import {TableColumn} from '../types';
import {Icon} from '../../../Icon';
import ColumnSetting from './ColumnSetting.vue'

export default defineComponent({
    name: 'TableActions',
    components:{
      ElDropdown,
      ElDropdownMenu,
      ElDropdownItem,
      ColumnSetting
    },
    props: {
      columns: {
        type: Array as PropType<TableColumn[]>,
        default: () => [],
      },
    },
    emits: ['refresh', 'changSize', 'confirm'],
    setup(props, { emit }) {

      const showSetting = ref(false)
      const refresh = () => {
        emit('refresh');
      };

      const size = ref(['default', 'large', 'small']);
      const sizeMap = {
        default: '默认',
        large: '大',
        small: '小',
      };
      const changSize = (size: ComponentSize) => {
        emit('changSize', size);
      };
      const confirm = (columns: TableColumn[]) => {
        emit('confirm', columns)
      }

      const showColumnSetting = () => {
        showSetting.value = true
      }
      return () => (
          <>
            <div class="text-right h-28px flex items-center justify-end">
              <div title="刷新" class="w-30px h-20px flex items-center justify-end" onClick={refresh}>
                <Icon
                    icon="ant-design:sync-outlined"
                    class="cursor-pointer"
                    hover-color="var(--el-color-primary)"
                />
              </div>

              <ElDropdown trigger="click" onCommand={changSize}>
                {{
                  default: () => {
                    return (
                        <div title="尺寸" class="w-30px h-20px flex items-center justify-end">
                          <Icon
                              icon="ant-design:column-height-outlined"
                              class="cursor-pointer"
                              hover-color="var(--el-color-primary)"
                          />
                        </div>
                    )
                  },
                  dropdown: () => {
                    return (
                        <ElDropdownMenu>
                          {{
                            default: () => {
                              return unref(size).map((v) => {
                                return (
                                    <ElDropdownItem key={v} command={v}>
                                      {sizeMap?.[v]}
                                    </ElDropdownItem>
                                )
                              })
                            }
                          }}
                        </ElDropdownMenu>
                    )
                  }
                }}
              </ElDropdown>

              <div
                  title="列设置"
                  class="w-30px h-20px flex items-center justify-end"
                  onClick={showColumnSetting}
              >
                <Icon
                    icon="ant-design:setting-outlined"
                    class="cursor-pointer"
                    hover-color="var(--el-color-primary)"
                />
              </div>
            </div>
            <ColumnSetting v-model={showSetting.value} columns={props.columns} onConfirm={confirm} />
          </>
      )
    },
  });
</script>

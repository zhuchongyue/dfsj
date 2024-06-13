import {baseProps, footerProps, headerProps} from '../../Modal/src/props';
import {PropType} from 'vue';

export type Options = {
  id: string;
  onAction?: (action: string, model?: {}) => void;
  onSubmit?: (model?: {}) => void;
  onCancel?: () => void;
  content: string | Function;
  directly?: boolean;
  props?: {
    [key: string]: any;
  };
} & Partial<typeof baseProps> &
  Partial<typeof headerProps> &
  Partial<typeof footerProps>;
export const WindowsProps = {
  items: { type: Array as PropType<Options[]> },
  front: String,
  layer: Number,
};

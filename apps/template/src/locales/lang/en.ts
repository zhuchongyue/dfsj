import { genMessage } from '../helper';
import enCn from 'element-plus/dist/locale/en.min.mjs'

const modules = import.meta.glob('./en/**/*.ts', { eager: true });
export default {
  message: {
    ...genMessage(modules as Recordable<Recordable>, 'en'),
    enCn,
  },
  dateLocale: null,
  dateLocaleName: 'en',
};

import { createPinia } from 'pinia';
import boardPlugin from './plugins/board.plugin';
import windowPlugin from './plugins/window.plugin';
import {App} from "vue";
const store = createPinia();

export function setupStore(app: App<Element>) {
  store.use(windowPlugin());
  store.use(boardPlugin());
  app.use(store);
}
export { store };

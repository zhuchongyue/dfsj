import { createApp } from 'vue';
import 'uno.css';
import 'virtual:uno.css'
import './plugins/svgIcon/index.ts'
import App from './App.vue';
import dayjs from 'dayjs';
import ElementPlus from 'element-plus';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import '/@/design/index.scss';
import 'element-plus/dist/index.css';
import {setupI18n} from "/@/locales/setupI18n.ts";
import {setupStore} from "/@/store";
import { router, setupRouter } from './router';
import {setupRouterGuard} from "/@/router/guard";
import "@dfsj/components/src/themes/index.ts"
import {initAppConfigStore} from "/@/logics/initAppConfig.ts";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai');
async function bootstrap() {
    // 创建应用实例
    const app = createApp(App);
    // 多语言配置,异步情况:语言文件可以从服务器端获得
    await setupI18n(app);
    // indexdb 储存
    // await setupLocalforageCache();
    app.use(ElementPlus);
    // app.use(directives);
    // 配置存储
    setupStore(app);
    // 初始化内部系统配置
    initAppConfigStore();
    // 配置路由
    setupRouter(app);
    // 路由保护
    setupRouterGuard(router);
    await router.isReady();
    app.mount('#app');
}
bootstrap();
/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * https://github.com/anncwb/vite-plugin-html
 */
import type {Plugin}           from 'vite';
import {createHtmlPlugin}      from 'vite-plugin-html';
import pkg                     from '../../../package.json';
import {GLOB_CONFIG_FILE_NAME} from '../../constant';

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const {VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH, VITE_ENV } = env;
  const path = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`;
  const getAppConfigSrc = () => {
    return `${path || '/'}${GLOB_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`;
  };
  let injectScript = `
   <script>  
      
    </script>
  `
  const htmlPlugin = createHtmlPlugin({
    viteNext: true,
    minify: isBuild,
    /**
     * 在这里写entry后，你将不需要在`index.html`内添加 script 标签，原有标签需要删除
     * @default src/main.ts
     */
    entry: '/src/main.ts',
    /**
     * 如果你想将 `index.html`存放在指定文件夹，可以修改它，否则不需要配置
     * @default index.html
     */
    // template: 'public/index.html',
    template: 'index.html',

    /**
     * 需要注入 index.html ejs 模版的数据
     */
    inject: {
      data: {
        title: VITE_GLOB_APP_TITLE,
        icon:"images/menu/app_icon.svg",
        // injectScript: `<script src="./inject.js"></script>`,
        injectScript,
      },
      tags: isBuild
          ? [
            {
              tag: 'script',
              attrs: {
                src: getAppConfigSrc(),
              },
            },
          ]
          : [],
    },
  })
  return htmlPlugin;
}

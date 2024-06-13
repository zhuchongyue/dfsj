// 打包结果分析
import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import type { Plugin } from 'vite';
import purgeIcons from 'vite-plugin-purge-icons';
import glsl from 'vite-plugin-glsl';
//tailwindcss 换成了UnoCSS
import UnoCSS from 'unocss/vite';
import { presetTypography, presetUno } from 'unocss';

// mock数据
import { configCompressPlugin } from './compress';
// import { configImageminPlugin } from './imagemin'; //图片压缩
// import OptimizationPersist    from 'vite-plugin-optimize-persist'; //持久化缓存
// import PkgConfig              from 'vite-plugin-package-config';

/**
 *
 *     "vite-plugin-optimize-persist": "^0.1.2",
 *     "vite-plugin-package-config": "^0.1.1",
 */
import { configHtmlPlugin } from './html';
import { configMockPlugin } from './mock';
// 代码压缩
import { configSvgIconsPlugin } from './svgSprite';
// svg图标
import { configVisualizerConfig } from './visualizer';
// 按需引入 组件vxe-table
import { configStyleImportPlugin } from './styleImport';

// @ts-ignore
export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_USE_MOCK } = viteEnv;

  const vitePlugins: (Plugin | Plugin[])[] = [
    vue(),
    vueJsx(),
    glsl(),
    legacy({
      targets: ['chrome < 60', 'edge < 15'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      modernPolyfills: [
        'es.array.filter',
        'es.array.at',
        'es.promise',
        'es.array.for-each',
        'es.promise.finally',
      ],
      polyfills: [
        'es.symbol',
        'es.array.filter',
        'es.array.at',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.for-each',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all',
      ],
    }),
  ];

  vitePlugins.push(UnoCSS({ presets: [presetUno(), presetTypography()] }));
  // vite-plugin-html
  // @ts-ignore
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));
  // vite-plugin-svg-icons

  // vite-plugin-style-import 
  vitePlugins.push(configStyleImportPlugin(isBuild));

  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerConfig());
  vitePlugins.push(configSvgIconsPlugin(isBuild));
  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild));
  // vite-plugin-theme【解决vite首次打开界面加载慢问题】
  // vitePlugins.push(PkgConfig());
  // vitePlugins.push(OptimizationPersist());

  // vite-plugin-purge-icons
  vitePlugins.push(
    purgeIcons({
      format: 'json',
    })
  );
  if (isBuild) {
    // TODO 正式打包将开启（图片资源压缩与代码压缩） 配合nginx gzip压缩使用
    // vite-plugin-imagemin
    // VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());
    // rollup-plugin-gzip
    // vitePlugins.push(configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE));
    vitePlugins.push(configCompressPlugin('gzip', false));
    vitePlugins.push(
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      })
    );
    vitePlugins.push(
      Components({
        resolvers: [ElementPlusResolver()],
      })
    );
  } else {
    vitePlugins.push(
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      })
    );
  }
  return vitePlugins;
}

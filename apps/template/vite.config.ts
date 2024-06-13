import dayjs from 'dayjs';
import { resolve } from 'path';
import sass from 'sass';
import { defineConfig, loadEnv } from 'vite';
import { OUTPUT_DIR } from './build/constant';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { createProxy } from './build/vite/proxy';
import pkg from './package.json';
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const isBuild = command === 'build';
  const { VITE_PORT, VITE_PROXY, VITE_DROP_CONSOLE, VITE_PUBLIC_PATH } =
      viteEnv;
  const { dependencies, devDependencies, name, version } = pkg;
  const __APP_INFO__ = {
    pkg: { dependencies, devDependencies, name, version },
    lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
  return {
    base: VITE_PUBLIC_PATH,
    root,
    esbuild: {
      drop: ['debugger'],
    },
    define: {
      __VUE_OPTIONS_API__: true,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import '/@/design/var.default.scss';  
          @import '/@/design/mixins.scss';  
          @import '/@/design/token/_breakpoint.scss';  
          @import '/@/design/token/_global.scss';  
          `,
          implementation: sass,
        },
      },
    },
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
        {
          find: /@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    server: {
      open: true,
      host: true,
      hmr: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
    },
    build: {
      outDir: OUTPUT_DIR,
      minify: 'terser',
      target: 'es2015',
      sourcemap: false,
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 控制台打印开关
          drop_console: VITE_DROP_CONSOLE,
          drop_debugger: VITE_DROP_CONSOLE,
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
      },
      include: ['@vue/runtime-core', '@vue/shared', '@iconify/iconify'],
    },
  };
});

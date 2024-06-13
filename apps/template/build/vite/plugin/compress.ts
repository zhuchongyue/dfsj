/**
 * 打包代码压缩
 * Used to package and output gzip. Note that this does not work properly in Vite, the specific reason is still being investigated
 * https://github.com/anncwb/vite-plugin-compression
 */
import type { Plugin } from 'vite';
// @ts-ignore
import compressPlugin from 'vite-plugin-compression';

export function configCompressPlugin(compress: 'gzip' | 'brotli' | 'none', deleteOriginFile = false): Plugin | Plugin[] {
  const compressList = compress.split(',');

  const plugins: Plugin[] = [];

  if (compressList.includes('gzip')) {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        deleteOriginFile,
        threshold:10240, //b
      })
    );
  }

  if (compressList.includes('brotli')) {
    plugins.push(
      compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile,
      })
    );
  }
  return plugins;
}

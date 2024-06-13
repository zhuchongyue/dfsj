/**
 * Used to parse the .env.development-qydl proxy configuration
 */
import type { ProxyOptions } from 'vite';

type ProxyItem = [string, string];

type ProxyList = ProxyItem[];

type ProxyTargetList = Record<string, ProxyOptions>;

const httpsRE = /^https:\/\//;

const filterRewrites = ['RPC2_Login','RPC2', 'RPC_Loadfile', 'web_caps'] // 大华视频
const isReWrite = path => filterRewrites.every(v => path.indexOf(v) == -1);

/**
 * Generate proxy
 * @param list
 */
export function createProxy(list: ProxyList = []) {
  const ret: ProxyTargetList = {};
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target);

    const prefixArray = prefix.split('|')

    prefixArray.forEach(route => {
      const prefix2 =  route.indexOf('/') == 0 ?  `${route}` : `/${route}`
      // https://github.com/http-party/node-http-proxy#options
      ret[prefix2] = {
        target: target,
        changeOrigin: true,
        ws: true,
        rewrite: (path) =>  isReWrite(path) ? path.replace(new RegExp(`^${prefix}`), '') : path,
        // https is require secure=false
        ...(isHttps ? { secure: false } : {}),
      };
    })
  }
  return ret;
}

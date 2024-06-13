import {NetEnum} from "/src/enums/netEnum";
import { isDevMode as DevMode } from '/src/utils/env';
/***
 * 是否是开发环境
 */
export const isDev = () => {
    // const mode = import.meta.env.MODE
    // return mode?.indexOf('development') != -1;
    return DevMode()
}
/**
 * 验证是否是正确的域名地址
 */
const isValidDomain = () => {
    let doName = /^([\w-]+\.)+((com)|(net)|(org)|(gov\.cn)|(info)|(cc)|(com\.cn)|(net\.cn)|(org\.cn)|(name)|(biz)|(tv)|(cn)|(mobi)|(name)|(sh)|(ac)|   (io)|(tw)|(com\.tw)|(hk)|(com\.hk)|(ws)|(travel)|(us)|(tm)|(la)|(me\.uk)|(org\.uk)|(ltd\.uk)|(plc\.uk)|(in)|(eu)|(it)|(jp))$/;
    let flag = doName.test(document.domain);
    if (!flag) {
        return false
    } else {
        return true
    }
}
/***
 *  检验正确的ip地址
 */
const isValidIP = (ip) => {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}
/***
 * 计算ip数值
 * @param ipAddress
 */
export const getIpNum = (ipAddress) => {/*获取IP数*/
    let ip = ipAddress.split(".");
    let a = parseInt(ip[0]);
    let b = parseInt(ip[1]);
    let c = parseInt(ip[2]);
    let d = parseInt(ip[3]);
    let ipNum = a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d;
    return ipNum;
}
/***
 * 是否包含在规定网段
 * @param userIp
 * @param begin
 * @param end
 */
export const isContain = (userIp, begin, end) => {
    return (userIp >= begin) && (userIp <= end);
}

export function useNetType() {
    /***
     * 1、开发环境下（localhost:xxx、172.0.0.1:xxx、192.168.x.x:xxx、10.10.x.x:xx）
     *     加载egis互联网服务地址
     *
     * 2、生产环境下（域名、政务网59、互联网120、专网10）
     *     分别访问对应的网段ip下的服务地址
     */
        let location: string | any = window.location.href;
    // let location = 'http://192.42.245.59:8081/'
    const isDevMode = isDev()
    const isInner = false;
    const state = reactive({
        isDev: isDevMode,
        isInner: isInner,
        net: null,
    })
    state.net = NetEnum.INTERNET;
    if (isDevMode) {

    } else {
        /***
         * 1、检查是不是域名访问
         */
        if (isValidDomain()) {

        } else {
            state.isInner = true;
            /**
             * ip情况
             * */
                //获取服务器ip地址
            const reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
            const ip = reg.exec(location)[0];
            if (!isValidIP(ip)) throw Error('不合法的ip地址！');
            let ipNum = getIpNum(ip);

            console.log('服务器ip', ip, isValidIP(ip), ipNum);
            /**
             * 专网
             */
            if (isContain(ipNum, getIpNum("10.0.0.0"), getIpNum("10.255.255.255"))
                || isContain(ipNum, getIpNum("172.0.0.0"), getIpNum("172.255.255.255"))
                || isContain(ipNum, getIpNum("192.0.0.0"), getIpNum("192.255.255.255"))
            ) {
                state.net = NetEnum.PRIVATE;
            } else if (isContain(ipNum, getIpNum("120.0.0.0"), getIpNum("120.255.255.255"))) {
                state.isInner = false;
                state.net = NetEnum.INTERNET;
            } else if (isContain(ipNum, getIpNum("58.0.0.0"), getIpNum("58.255.255.255"))
                || isContain(ipNum, getIpNum("59.0.0.0"), getIpNum("59.255.255.255"))
            ) {
                state.isInner = false;
                state.net = NetEnum.INTERNET;
            }

            console.log(toRaw(unref(state)))
        }
    }
    return {...toRaw(state)}

}


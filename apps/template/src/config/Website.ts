import {useNetType} from '/@/hooks/core/useNetType';
import {getAppEnvConfig} from "@/utils/env.ts";
import {GisPlatformEnum, GisProjectionEnum} from "@/enums/appEnum.ts";

/**
 * Global application config. Readonly!
 * Any updatable config must put in Vuex.store.
 */
const Website = Object.freeze({
    APP_TITLE: getAppEnvConfig().VITE_GLOB_APP_TITLE,
    APP_SUB_TITLE: getAppEnvConfig().VITE_SECONDARY_TITLE,
    SUCCESS_CODE: 0, // The success code from server.
    DEFAULT_PLATFORM: GisPlatformEnum.OPENLAYERS,
    DEFAULT_THEME: 'default',
    DEFAULT_PROJECTION: GisProjectionEnum.EPSG4326,
    VIEWPORT_WIDTH: 1920, //1280,
    BASE_FONT_SIZE: 16, //12,
    REM_ROOT_VALUE: 16,
    MIN_REQUEST_INTERVAL: 500,
    MODAL_Z_INDEX: 1000,
    //网络环境，0：互联网，1：安监网，3：政务外网
    NET: (() => {
        const config = useNetType();
        let net = config.net;
        if (
            Reflect.has(window?.globalEnvs, 'net') &&
            window?.globalEnvs?.net > -1
        ) {
            net = window?.globalEnvs?.net;
        }
        return net;
    })(),
    RED_COLOR: '#f44336',
    ORANGE_COLOR: '#F2973D',
    YELLOW_COLOR: '#E0D016',
    BLUE_COLOR: '#027be3',
    DEFAULT_COLOR: '#00ABDF',
    RED_COLOR_RGB: 'rgb(244, 67, 54, 0.5)',
    ORANGE_COLOR_RGB: 'rgb(242, 151, 61, 0.5)',
    YELLOW_COLOR_RGB: 'rgb(224, 208, 22, 0.5)',
    BLUE_COLOR_RGB: 'rgb(2, 123, 227, 0.5)',
    DEFAULT_COLOR_RGB: 'rgb(0, 171, 223, 0.5)',
});
export default Website;
import {emitter} from "@dfsj/utils";
import {EMapLink} from "@/enums/mittTypeEnum.ts";
import {onBeforeUnmount, onMounted} from 'vue';
import {findStationDetailCfg} from "@/components/Explorer/src/api.ts";
import {useRootStoreWithOut} from "@/store/root.ts";
import ExplorerConfig from "../components/Explorer/src/config";

const TARGET = {
    "mocd": "RR_60800520",
    "monm": "乌江渡电站",
    "motype": 1,
    "stcd": "60800520",
    "stnm": "乌江渡电站",
    "sttype": 1,
    "lgtd": 106.760972641468,
    "lttd": 27.3199626640914,
    "address": "遵义市播州区乌江镇",
    "eacId": "modelcj_10676348002731921",
    "exparams": null,
    "adcd": "520304105000000",
    "adnm": "乌江镇",
    "wscd": "1631000000",
    "wsnm": "乌江水系",
    "padcd": null,
    "padnm": null,
    "datasource": null,
    "source": null,
    "remark": null,
    "sttp": "RR",
    "province": null,
    "city": "遵义市",
    "county": "播州区",
    "town": "乌江镇",
    "village": null,
    "geom": null,
    "rivercode": null,
    "rivername": null,
    "question": null,
    "toper": null,
    "dsj": null,
    "dsj_tel": null,
    "zr": null,
    "zr_tel": null,
    "fgj_zrr": null,
    "fgj_tel": null,
    "fyb_zrr": null,
    "fyb_tel": null,
    "citytype": null,
    "bldarea": null,
    "population": null,
    "mainriver": null,
    "wsarea": null,
    "stdyear": null,
    "ctrlnm": null,
    "zz": null,
    "qq": null,
    "fx_zrr": null,
    "duties": null,
    "wscdnm": null,
    "mgname": null,
    "ttcps": null,
    "damshape": null,
    "dssafe": null,
    "damheight": null,
    "floodsafe": null,
    "outwatersafe": null,
    "ismakesafe": null,
    "isemergency": null,
    "isempty": null,
    "isrefer": null,
    "isbuildingsafe": null,
    "iswarningtip": null,
    "isclean": null,
    "othersafe": null,
    "rivers": null,
    "orgnm": null,
    "yearbuild": null,
    "volume": null,
    "supplywater": null,
    "benefits": null,
    "actarea": null,
    "isnormbenefit": null,
    "notreason": null,
    "isreinforcement": null,
    "isrenovate": null,
    "isexpansion": null,
    "seqno": null,
    "len": null,
    "paths": null,
    "phase": null,
    "location": null,
    "defenseDepart": null,
    "defensePerson": null,
    "defensePhone": null,
    "buildCompany": null,
    "buildPerson": null,
    "buildPhone": null,
    "constructionCompany": null,
    "constructionPerson": null,
    "constructionPhone": null,
    "supervisorCompany": null,
    "supervisorPerson": null,
    "supervisorPhone": null,
    "company": null,
    "way": null,
    "type": null,
    "fixed": null,
    "personnels": null,
    "status": null,
    "person": null,
    "phone": null,
    "jdtype": null,
    "jdlevel": null,
    "communicationInfos": [],
    "sign": null,
    "altitude": 764.0,
    "rvnm": "乌江",
    "hnnm": null,
    "dangerRegionPopulation": null,
    "dangerRegionFamilyCount": null,
    "familyCount": null,
    "stnm_rel": null,
    "flood_cap": null,
    "riskLevelStr": null,
    "riskLevel": null,
    "riskTypeStr": null,
    "riskType": null,
    "damtypenm": null,
    "sttypenm": null,
    "is_automatic": null,
    "isautomatic": null,
    "xingzhengzrr": null,
    "technologzrr": null,
    "xunbazrr": null,
    "monitorzrr": null,
    "trasferzrr": null,
    "collectId": null,
    "latestW": null,
    "wlevel": null,
    "warning": null,
    "rotate": null,
    "personality": null,
    "tm": null,
    "drp": null,
    "dyp": null,
    "drp12": null,
    "drp24": null,
    "z": null,
    "q": null,
    "rz": null,
    "w": null,
    "tifValue": null,
    "tifLevel": null,
    "tifLevelName": null,
    "foreDrp": null,
    "count": null,
    "supNumber": null,
    "frgrd": null
};
export const DEFAULT_SIZE = ['60vw', '70vh'];

export function useLinkEvent() {
    onMounted(() => {
        bindEvent();
    });
    onBeforeUnmount(() => {
        unbindEvent();
    });

    function overlayClickHandle(movement: any = {target: TARGET}) {
        if (!Reflect.has(movement, 'target') || !Reflect.has(movement, 'type')) {
            return;
        }
        const target = movement?.target;
        const type = movement?.type as string;
        if (type?.toUpperCase?.() !== 'CLICK') return;
        /** 判断覆盖物的熟悉  以及类型 */
        const graphicType = target?.type;
        const property = target?.attr;
        // if (graphicType.toUpperCase() !== 'BILLBOARD') return;
        if (!Reflect.has(property, 'motype')) {
            console.error('请确保有 motype 值');
            return;
        }
        ;
        const motype = property?.motype;
        const cluster = property?.count > 1;
        console.log({motype, cluster})
        if (cluster) {
            console.log('点击了聚合点')
            return;
        }
        openExplorer(target?.attr)
    }

    /**
     * 绑定覆盖物点击事件 监听
     */
    function bindEvent() {
        emitter.on(EMapLink.OVERLAY_CLICK, overlayClickHandle);
    }

    /**
     * 取消覆盖物点击事件 监听
     */
    function unbindEvent() {
        emitter.off(EMapLink.OVERLAY_CLICK, overlayClickHandle);
    }

    /**
     * 打开资源器
     */
    function openExplorer(target) {
        // let target = TARGET;
        const config: any = ExplorerConfig[target.motype];
        const sizes =
            (typeof config === 'object' ? config?.sizes : DEFAULT_SIZE) ??
            DEFAULT_SIZE;

        console.log('打开', target, config)

        function loader() {
            const getConfig: Function =
                config instanceof Function ? config : config.loader;
            return Promise.all([
                getConfig(),
                findStationDetailCfg(
                    {mocd: target?.mocd ?? target?.stcd},
                ),
            ]).then(([{default: options}, tabs]) => {
                // console.log(options, 'zqj log options');
                // console.log(tabs, 'zqj log tabs');
                const renders = options.renders
                    ?.filter((e) => !(Reflect.has(e, 'disable') && e.disable))
                    .sort((a, b) => a.order - b.order);
                if (Array.isArray(tabs)) {
                    // 从接口返回显示的 tabs
                    const showTab = tabs.reduce((obj, curr) => {
                        return {...obj, ...curr};
                    }, {});
                    const showRenders = renders.filter((tab) => showTab[tab.name]);
                    return Object.assign({}, options, {
                        renders: showRenders,
                    });
                }
                return Object.assign({}, options, {renders});
            });
        };
        useRootStoreWithOut().window.open({
            title: target?.stnm || target?.monm,
            id: target?.stcd,
            sizes: ['60vw', '70vh'],
            content: () => import('/@/components/Explorer/src/Explorer.vue'),
            props: {
                options: {
                    loader
                },
                target,
            }
        })

    }


}
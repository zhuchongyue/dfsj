import {NullLayerProvider} from "@dfsj/components/src/components/NodeAxis";
import Dates from "@/components/Visual/utils/Dates.ts";
import {useUserStoreWithOut} from "@/store/modules/user.ts";

export function getVisualContent(origin: any) {
    let content = {
        id: origin.id,
        origin,
        datatype: origin.datatype,
        loading: false,
        label: origin.label,
        provider: NullLayerProvider.SINGLETON,
        time: Dates.stringify(),
        times: [Dates.specify(-7), Dates.stringify()],
        buttons: {
            daily: !!origin.dailyable,
            range: !!origin.rangeid,
            statistic: !!origin.anytimeable,
        },
        injection: {
            user: {
                adcd: useUserStoreWithOut().getUserInfo?.adcd,
                wscd: useUserStoreWithOut().getUserInfo?.wscd,
                adnm: useUserStoreWithOut().getUserInfo?.adnm,
            },
            filter: {legend: origin.legend?.items[origin.legend.index].value},
        },
    };
    return content

}
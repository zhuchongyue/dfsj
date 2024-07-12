import Define from "/@/config/Define";

/***
  各类站点的展示tab配置
 */
const ExplorerMotypeConfig =    {
        [Define.Resource.RESERVOIR]: {
            // sizes: ["75vw", "50vh"],
            loader: () => import("./tab.reservoir"),
        },
        [Define.Resource.RAINFALL_STATION]: () => import("./tab.rainfall"),
        [Define.Resource.HYDROLOGY_STATION]: () => import("./tab.hydrology"),
    }
export default ExplorerMotypeConfig
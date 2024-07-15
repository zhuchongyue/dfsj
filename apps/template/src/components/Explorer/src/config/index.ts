import Define from "/@/config/Define";

/***
  各类站点的展示tab配置
 */
const ExplorerConfig =    {
        [Define.Resource.RESERVOIR]: {
            // sizes: ["75vw", "50vh"],
            loader: () => import("./reservoir.config.ts"),
        },
        [Define.Resource.RAINFALL_STATION]: () => import("./rainfall.config.ts"),
        [Define.Resource.HYDROLOGY_STATION]: () => import("./hydrology.config.ts"),
    }
export default ExplorerConfig
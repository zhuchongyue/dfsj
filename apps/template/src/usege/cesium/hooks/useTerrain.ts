import * as ECCesium from '@dfsj/cesium';
import {getGis} from '@/core/GisCache.ts';
import {onBeforeUnmount} from 'vue';

const Cesium = ECCesium.getLib('Cesium');

/**
 * 做一些不要的地形加载
 * 并且地形夸张
 * 后台平滑：/title/dem/demph
 * 5米正常：/title/dem/demgz
 */
const baseUrl = `https://58.42.237.172:8188`;
const def = {
  name: '贵州省正常5米地形',
  requestVertexNormals: true,
  url: new Cesium.Resource({
    url: baseUrl + `/title/dem/demgz`,
  }),
};
let last = 0;
export function useTerrain() {
  const addTerrain = (options = def) => {
    const terrain = ECCesium.TerrainFactory.createUrlTerrain(options as any);
    getGis().setTerrain(terrain);
  };
  const removeTerrain = () => {
    getGis().setTerrain(null);
  };

  const setExaggeration = (number: number) => {
    if (last === number) return;
    getGis().scene.globe.depthTestAgainstTerrain = false;
    last = number;
    getGis().scene.globe.terrainExaggeration = number;
    // getGis().scene.verticalExaggeration = 1;
    // getGis().scene.screenSpaceCameraController.verticalExaggeration = 1;
  };

  onBeforeUnmount(removeTerrain);
  return {
    addTerrain,
    removeTerrain,
    setExaggeration,
  };
}

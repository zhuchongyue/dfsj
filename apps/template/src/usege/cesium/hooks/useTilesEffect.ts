/**
 * 3d tiles 作为第一视角
 */
import {getGis} from '@/core/GisCache.ts';
import {useTiles} from './useTiles';
import {useTilesVectorManage} from './useTilesVectorManage.ts';

const zhuXin = {
  tilesHeight: -47000,
  tilesLng: 106.560005,
  tilesLat: 26.961765,
  tilesScale: 0.76,
  isShow3DTiles: true,
  isShowpolyline: true,
  switch001: true,
  selectValue: 0,
};
export const use3DTileEffect = () => {
  const { render } = useTilesVectorManage();
  const { createTiles, delTiles, setTilesCfg } = useTiles();
  const tilesObj = {
    id: 'global.3dtile.id',
    tileset: null,
  };
  function addEffect() {
    const url = 'https://58.42.237.172:8188/title/modelgz/tileset.json';
    console.log('getGis', getGis());
    getGis().scene.globe.depthTestAgainstTerrain = false;
    // getGis().loadingMask.enable = true;
    const ary = [
      {
        url,
        options: {},
      },
    ];
    const { layerAry } = createTiles({
      id: tilesObj.id,
      flyTo: false,
      ary,
    });
    console.log('layerAry', layerAry);
    tilesObj.tileset = layerAry[0];
    tilesObj.tileset.delegate.then(() => {
      setTilesCfg({
        tileset: tilesObj.tileset,
        tilesHeight: zhuXin.tilesHeight,
        tilesLng: zhuXin.tilesLng,
        tilesLat: zhuXin.tilesLat,
        tilesScale: zhuXin.tilesScale,
      });
      // callback();
      getGis().loadingMask.enable = false;
      // TODO:调试
      // addPolygon({})
      // get3DTilesLLA();
      setTimeout(() => {
        render();
      }, 3000);
    });
  }

  return {
    addEffect,
  };
};

import {useTilesPolygonToMaterial} from './useTilesPolygonToMaterial.ts';
import * as ECCesium from '@dfsj/cesium';
import {VectorLayer} from '@dfsj/cesium';
import {getGis} from '@/core/GisCache.ts';

const Cesium = ECCesium.getLib('Cesium');
/**
 * 矢量面线的上图  填充材质
 */
export function useTilesVectorManage() {
  const { setUrlParams, generateBase64, transBase64FromImage, addPolygon } =
    useTilesPolygonToMaterial();
  const render = (
    id = 'test' + Math.random() * 2000,
    geojson = '/json/gz.geojson',
    alpha = 0.5
  ) => {
    const layerCfg = {
      format: 'image/png',
      version: '1.0.0',
      transparent: true,
      service: 'WMS',
      request: 'GetMap',
      styles: '',
      layers: 'yjgl:drought_danger_gz',
      bbox: '103.59942612, 24.62194398, 109.59386004, 29.2243792',
      width: 512,
      height: 512,
      srs: 'EPSG:4326',
    };
    const url = `https://58.42.237.172:8188/geoserver/yjgl/wms`;
    const fullUrl = setUrlParams({ url, ...layerCfg });
    console.log({ fullUrl });
    generateBase64(fullUrl).then((base64) => {
      getGis().scene.globe.depthTestAgainstTerrain = false;
      const layer = new VectorLayer(id);
      getGis()?.addLayer(layer);
      const style = {
        fill: true, // 填充面
        zIndex: 1, // 层级
        heightReference: 1,
        // 材质
        material: new Cesium.ImageMaterialProperty({
          image: base64,
          transparent: true,
          color: new Cesium.Color(1.0, 1.0, 1.0, alpha), // 红、绿、蓝和透明度,设置颜色和透明度
        }),
      };
      addPolygon(id, geojson, { style }).then((polygons) => {
        console.log('polygons', polygons);
        if (polygons?.length) {
          layer.addOverlays(polygons);
        }
      });
    });
  };

  return {
    render,
  };
}

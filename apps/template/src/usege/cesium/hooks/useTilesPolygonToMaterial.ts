import {setObjToUrlParams} from '@/utils/route.ts';
import {Color, GeoJsonLayer, MouseEventType, Polygon} from '@dfsj/cesium';

/**
 * 这个方案是  在3dtile 上绘制一个矢量面  将矢量面填充颜色变成材质，这个材质是通过一整张和矢量面重合的一张整图。
 */
export function useTilesPolygonToMaterial() {
  const addPolygon = (
    id,
    geojson,
    config = { attr: {}, style: {} },
    events = { type: [], callback: (...args) => {} }
  ) => {
    return new Promise(async (resolve, reject) => {
      let polygons = [];
      await new Promise((resolve) => {
        new GeoJsonLayer(`geojson.${id}`, geojson).eachOverlay((item) => {
          console.log('item', item);
          if (item.polygon) {
            //@ts-ignore
            let polygon = Polygon.fromEntity(item);
            polygon.attr = config.attr;
            polygon.setStyle(
              config.style && Object.keys(config.style).length > 0
                ? config.style
                : {
                    zIndex: 1,
                    heightReference: 1,
                    material: Color.fromCssColorString('color').withAlpha(1), // 材质
                  }
            );
            if (events.type.length > 0) {
              events.type.forEach((ev) => {
                polygon.on(MouseEventType?.[ev], (e) => {
                  // eslint-disable-next-line n/no-callback-literal
                  events.callback({
                    eventType: ev,
                    eventData: e,
                    attr: config.attr,
                    entity: polygon,
                  });
                });
              });
            }
            polygons.push(polygon);
            resolve(true);
          }
        }, null);
      });
      resolve(polygons);
    });
  };

  /**
   * 将请求的路径条件加到地址上
   * @param url
   * @param other
   */
  const setUrlParams = ({ url, ...other }) => {
    return setObjToUrlParams(url, other);
  };
  /**
   * 将图片转换成base64
   * @param image
   */
  const transBase64FromImage = (image) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);
    // 可选其他值 image/jpeg
    return canvas.toDataURL('image/png');
  };
  /**
   * 将转换成base64的图片设置成可跨域
   * @param src
   */
  const generateBase64 = (src: string) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src + '&t=' + new Date().getTime();
      image.crossOrigin = '*';
      image.onload = () => {
        const base64 = transBase64FromImage(image);
        resolve(base64);
      };
    });
  };

  return {
    generateBase64,
    transBase64FromImage,
    addPolygon,
    setUrlParams,
  };
}

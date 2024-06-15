/***
  用于搜索结果点击定位的作用
 */
import { wktToGeoJSON } from '@terraformer/wkt';
import { onBeforeUnmount } from 'vue';

import website from '/@/config/website';
import GraphicManage from '/@/core/Resource/core/GraphicManage';
import { useFlyTo } from '/@/core/Resource/hooks/useFlyto';
import overlays from '/@/layouts/map/config/graphic.overlays';
import { Transform } from '/@/packages/ol/src/modules/proj';

let uniqueName: any = 'search_location_layer';
export function useSearchLocation() {
  const { fly, flyHome } = useFlyTo();
  /** 创建*/
  function create(item: any) {
    let archive = item?.archive;
    GraphicManage.remove(uniqueName);
    if (!archive) return;
    archive.stcd = archive?.code;
    const config = {
      type: 'feature',
      identity: (v) => v.mocd || v.stcd || v.code || v.id,
      fields: '*',
      overlay: overlays[archive?.motype],
      format: {
        type: 'wkt',
        id: (v) => v.mocd || v.stcd || v.code || v.id,
        coordinate: (v) => v?.wkt,
        graphic: 'billboard',
        fields: '*',
        projection: {
          from: Transform.PROJ.WGS84,
          to: website.DEFAULT_PROJECTION,
        },
      },
      styleRenderer: {
        loses: {
          type: 'billboard',
          normal: {
            scale: 0.5,
            zIndex: 99,
            label: {
              font: '14px arial',
              offset: [0, 25],
              outlineWidth: 3,
              color: 'white',
              outlineColor: 'rgb(0,171,223)',
              text: (e) => e.name,
              rotation: 0,
            },
            image: (item) => {
              return `/images/layer/${archive.motype}/${
                archive.level || archive.wlevel || archive.warnLevel || 0
              }.png`;
            },
          },
        },
      },
    };
    GraphicManage.addition(uniqueName, config, [archive]);
    const geo = wktToGeoJSON(archive?.wkt);
    const coords = geo?.coordinates;
    fly(coords);
  }
  onBeforeUnmount(() => {
    flyHome();
    GraphicManage.remove(uniqueName);
  });

  return {
    create,
  };
}

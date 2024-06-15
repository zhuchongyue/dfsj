import { GisSymbolKey, getGis } from '/@/core/GisCache';
import ImageryManage from '/@/core/Resource/core/ImageryManage';
import basemap from '/@/layouts/map/config/basemap';
import { globalService } from '/@/layouts/map/config/global.service';
import { useAppStore } from '/@/store/modules/app';
import {isQYDLEnv, isSWJEnv, isWLSDEnv, isCQCJEnv } from '/@/utils/env';

import { useMaskCrop } from '@/core/Resource/hooks';

const { dispose, createMaskCrop } = useMaskCrop();

export function useMapSwitch() {
  const appStore = useAppStore();
  function onSwitch(config, { index, label, type }: any) {
    appStore.mapIndex = index;
    console.log('config', config);
    const map = getGis(GisSymbolKey.default);
    const key = 'layerName';
    const value = config.layerName;
    map?.changeBaseLayer?.(key, value);
    removeAdditional();
    const sxTarget = basemap?.find(item => item.__markID == 'sx')
    if (value !== sxTarget?.layerName) { // value !== basemap?.[0]?.layerName
      // console.log('附加')
      loadAdditional(config);
    } else {
      // console.log('移除附加')
      removeAdditional();
    }
    if (isSWJEnv() || isWLSDEnv() || isCQCJEnv()) setTimeout(createMaskCrop, 100);
  }

  //除了自定发布的需要加载流域图层，目前只有黔源电力和重庆长江有
  function loadAdditional(
    target = basemap.find(v => v.isDefault)
  ) {
    if (isSWJEnv() || isWLSDEnv() || isCQCJEnv()) return;

    const sxTarget = basemap.find(item => item.__markID == 'sx')
    if (target?.layerName == sxTarget?.layerName) return

    const bpj_river = isQYDLEnv()
      ? globalService.bpj_river
      : globalService.hf_river; //水系图
    ImageryManage.addition(bpj_river.layerName, bpj_river);
  }
  function removeAdditional() {
    if (isSWJEnv() || isWLSDEnv() || isCQCJEnv()) return;
    const bpj_river = isQYDLEnv()
      ? globalService.bpj_river
      : globalService.hf_river; //水系图
    ImageryManage.remove(bpj_river.layerName);
  }
  return {
    onSwitch,
    loadAdditional,
    removeAdditional
  };
}

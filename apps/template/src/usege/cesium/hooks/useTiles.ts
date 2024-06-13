import {Position, Tileset, TilesetLayer} from '@dfsj/cesium';
import {getGis} from '@/core/GisCache.ts';

export const useTiles = () => {
  let activeId = null;
  const createTiles = ({
    id = 'sy.use3DTiles.id',
    isAdd = true,
    isSole = true,
    ary = [
      {
        url: '',
        options: {},
      },
    ],
    defaultOptions = {
      maximumScreenSpaceError: 26, // 最大的屏幕空间误差, 官方默认16：越小精度越高，消耗性能就越多
      skipLevelOfDetail: true, // 优化选项。确定是否应在遍历期间应用详细级别跳过。
      baseScreenSpaceError: 1024, // 当skipLevelOfDetail是 时true，在跳过细节级别之前必须达到的屏幕空间错误。
      skipScreenSpaceErrorFactor: 16, // 当skipLevelOfDetail是 时true，定义要跳过的最小屏幕空间错误的乘数。与 结合使用skipLevels以确定要加载的图块。
      skipLevels: 1, // 当skipLevelOfDetail是 时true，一个常量定义加载图块时要跳过的最小级别数。当它为 0 时，不跳过任何级别。与 结合使用skipScreenSpaceErrorFactor以确定要加载的图块。
      immediatelyLoadDesiredLevelOfDetail: false, // 当skipLevelOfDetail是 时true，只有满足最大屏幕空间错误的图块才会被下载。跳过因素被忽略，只加载所需的图块。
      loadSiblings: false, // 当skipLevelOfDetail是 时true，决定是否在遍历过程中总是下载可见瓦片的兄弟。
      cullWithChildrenBounds: true, // 优化选项。是否使用其子边界体积的并集来剔除瓷砖。
      eleAlt: 0, // 修正高程
      disableVerticalExaggeration: true,
    },
    flyTo = false,
    duration = 1,
  }) => {
    isSole && delTiles(activeId);
    activeId = id;
    const layer = new TilesetLayer(id);
    // @ts-ignore
    isAdd ? getGis().addLayer(layer) : '';
    const tilesetAry = [];
    for (const value of ary) {
      const { url, options } = value;
      const defOp: any = { defaultOptions, ...options };
      const tileset = new Tileset(url, defOp);

      console.log('加载以后的tileset', tileset, layer);
      typeof defOp?.eleAlt === 'number' && defOp?.eleAlt > 0
        ? tileset.setHeight(defOp?.eleAlt)
        : ''; // ele:修正高程
      tilesetAry.push(tileset);
      layer.addOverlay(tileset);
    }
    flyTo && getGis()?.flyTo(tilesetAry[0], duration);
    return { layer, layerAry: tilesetAry };
  };
  function delTiles(id: string) {
    if (!id) return;
    const delLayer = getGis()?.getLayer(id);
    if (!delLayer) return;
    getGis()?.removeLayer(delLayer);
  }
  function setTilesCfg({ tileset, tilesHeight, tilesLng, tilesLat, tilesScale }) {
    if (!tileset) return;
    const cententPosition = Position.fromArray([tilesLng, tilesLat, tilesHeight]);
    cententPosition && tileset.setPosition(cententPosition);
    tileset.setScale(tilesScale || 1);
  }
  return {
    createTiles,
    delTiles,
    setTilesCfg,
  };
};

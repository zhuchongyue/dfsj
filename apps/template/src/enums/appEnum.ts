/**
 * 系统
 */
export const SIDE_BAR_MINI_WIDTH = 48;
export const SIDE_BAR_SHOW_TIT_MINI_WIDTH = 80;
export enum ContentEnum {
  // auto width
  FULL = 'full',
  // fixed width
  FIXED = 'fixed',
}
// menu theme enum
export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}
export enum SettingButtonPositionEnum {
  AUTO = 'auto',
  HEADER = 'header',
  FIXED = 'fixed',
}
export enum SessionTimeoutProcessingEnum {
  ROUTE_JUMP,
  PAGE_COVERAGE,
}
/**
 * 权限模式
 */
export enum PermissionModeEnum {
  // role
  // 角色权限
  ROLE = 'ROLE',
  // black
  // 后端
  BACK = 'BACK',
  // route mapping
  // 路由映射
  ROUTE_MAPPING = 'ROUTE_MAPPING',
}

// Route switching animation
// 路由切换动画
export enum RouterTransitionEnum {
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE = 'fade',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}
//gis平台
export enum GisPlatformEnum {
   OPENLAYERS = 'openlayers', //二维平台
   CESIUM = 'cesium',//三维平台
}
//gis投影
export enum GisProjectionEnum {
  EPSG4326 = 'EPSG:4326', //84
  EPSG3857 = 'EPSG:3857',//墨卡托
  EPSG4490 = 'EPSG:4490',//2000
}
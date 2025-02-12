/** 简单的配置文件
 *  登录配置：defaultlogin：【'basic','wx','phone','ukey'】
 *  系统icon svg或图片:appIcon
 *   系统标题：部署文件_app.config.js 下VITE_GLOB_APP_TITLE参数
 * */
window.globalEnvs = {
    map_service_url: 'http://dxdm.dfsjcloud.com',//底图服务
    // geoserverUrl:'http://58.42.237.172:8185/geoserver', //底图服务
    geoserverUrl: 'http://rkgeo.dfsjcloud.com/geoserver',//底图服务
    // geoserverUrl:'http://10.10.10.50:9100/geoserver' //底图服务
    //TODO 网络相关
    net: -1, // -1  根据自定义程序判断 //网络环境，0：互联网，1：安监网，3：政务外网
    //TODO 矢量上图相关
    geomType: 1, //geomType 0 wkt 1 wkb 默认为 0   有几个单元上图数据传输大 使用wkb减少1/3的大小

    //TODO 登录相关
    appid: 'wx1328f7f44e7669d4',
    redirect_uri: 'http://gzndy.dfsjcloud.com/login',
    wxlogin: true,  //微信登录
    phonelogin: true, //短信登录
    ukeylogin: true, //ukey登录
    defaultlogin: 'basic', //默认登录
    //TODO 系统图标
    appIcon: `/config/dfsj.svg`,
};
;
(function () {
    console.log('config', window.globalEnvs)
})();
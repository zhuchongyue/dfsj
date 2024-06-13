export enum EHiStateCode {
    ERROR_CODE_UNKNOWN = 1000, //未知错误
    ERROR_CODE_NETWORKERROR = 1001,//网络错误
    ERROR_CODE_PARAMERROR = 1002, //缺少插件元素
   //登录模块
    ERROR_CODE_LOGIN_NOLOGIN = 2000, // 未登录
    ERROR_CODE_LOGIN_REPEATLOGIN = 2001, //设备已登录，重复登录
    ERROR_CODE_LOGIN_NOSUPPORT = 2002, //当前设备不支持Digest登录
    //预览播放
    ERROR_CODE_PLAY_PLUGININITFAIL = 3000, //插件初始化失败
    ERROR_CODE_PLAY_NOREPEATPLAY = 3001, //当前窗口已经在预览
    ERROR_CODE_PLAY_PLAYBACKABNORMAL = 3002, //回放异常
    ERROR_CODE_PLAY_PLAYBACKSTOP = 3003, //回放停止
    ERROR_CODE_PLAY_NOFREESPACE = 3004, //录像过程中，硬盘容量不足
    //对讲
    ERROR_CODE_TALK_FAIL = 5000, //语音对讲失败
}
export enum VideoType {
    DaHua='DaHua',
    Hikvision='Hikvision',
}
export enum EventEnum {
    READY ='READY',//准备完成
    PLAY ='PLAY',//开始播放
    PAUSE ='PAUSE',//停止播放
    DISPOSE ='DISPOSE',//销毁
    ERROR ='ERROR',//发生错误
    PLUGIN ='PLUGIN'//安装插件
}
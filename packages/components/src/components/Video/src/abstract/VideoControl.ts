import AbstractVideoControl from "./AbstractVideoControl";
import Observable from "./Observable";

export interface VideoBaseOpt {
    ip: string,
    port: string | number,
    channel: string | number,
    username: string,
    streamType: string | number,
    password: string,
    //
    wrapEl: any,
    canvasEl: any,
    videoEl: any,

    needPlugin:boolean;
    needLogin:boolean;
}


//@ts-ignore
export default class VideoControl extends Observable implements AbstractVideoControl {
    public ip: string;//ip
    public port: string | number;//端口
    public channel: string | number;//通道
    public streamType: string | number;//码流类型

    public username: string;//用户
    public password: string;//密码

    public wrapEl:any;//外层的包裹容器




    public isPlayback: boolean;//是否回放
    public playbackIndex: number; //回放位置

    public state: object;//状态


    public player: any;//播放实例

    public needPlugin:boolean;// 是否需要安装插件
    public needLogin:boolean;// 是否需要登录

    constructor(opt: Partial<VideoBaseOpt>) {
        super()
        console.log('opt',opt)
        this.ip = opt.ip;
        this.port = opt.port;
        this.channel = opt.channel;
        this.streamType = opt.streamType;
        this.username = opt.username;
        this.password = opt.password;

        this.wrapEl= opt.wrapEl
    }

    get identify() {
        return this.ip + '_' + this.port;
    }

}
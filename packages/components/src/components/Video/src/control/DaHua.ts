import VideoControl, {VideoBaseOpt} from "../abstract/VideoControl";
import {EventEnum} from "../enums/CommonEnum";

const DEF: Partial<VideoBaseOpt> = {
    ip: '172.168.1.247',
    port: 80,
    username: 'admin',
    password: 'admin123',
    channel:1,
    streamType:0
}

declare let RPC:any;
declare let _getSession:any;
declare let PlayerControl:any;
export default class DaHua extends VideoControl {
    public canvasEl: any;//画布dom
    public videoEl: any;//视频标签dom
    constructor(opts: Partial<VideoBaseOpt>) {
        super({...DEF,...opts,})
        this.isPlayback = false;
        this.playbackIndex = 0;
        this.generateEl();
        this.play()
    }


    generateEl(){
        this.canvasEl = document.createElement('canvas');
        this.canvasEl.style.cssText ="position: absolute;left: 0;top: 0;width: 100%;height: 100%;"
        this.videoEl = document.createElement('video');
        this.videoEl.style.cssText ="display: none;width:100%;height:100%;position:absolute;top:0;left:0";
        if (this.wrapEl) {
            this.wrapEl.appendChild(this.canvasEl)
            this.wrapEl.appendChild(this.videoEl)
        }
    }

    removeEl(){
       const remove = (el)=>{
           let parent = el?.parentNode
           if (parent) {
               parent.removeChild(el)
           }
       }
        remove(this.videoEl);
        remove(this.canvasEl);
        this.videoEl = null;
        this.canvasEl = null;
    }

    login() {
        const {ip, port, username, password} = this;
        let target = ip + ':' + port;
        //@ts-ignore
        setIP(target);

        RPC.login(username, password, false).then((res) => {
            console.info('登录成功', res);
            RPC.keepAlive(300, 60000, _getSession(), target);
        })
    }

    stop() {
        this?.player?.pause?.();
        //@ts-ignore
        this.dispatch(EventEnum.PAUSE,{type:'Pause',target:this})
    }

    play(isPlayback = false) {
        this.stop()
        const {ip, port, username, password,streamType,channel} = this;
        let   url;
        let options = {
            wsURL: 'ws://' + ip + ':' + port + '/rtspoverwebsocket',
            rtspURL: !isPlayback ?
                'rtsp://' + ip + ':' + port + '/cam/realmonitor?channel=' + channel + '&subtype=' + streamType + '&proto=Private3' :
                'rtsp://' + ip + ':' + port + '/' + url,
            username: username,
            password: password,
            lessRateCanvas: true,
            playback: this.isPlayback,
            isPrivateProtocol: false,
            realm: RPC.realm, //设备登录返回的realm
            playbackIndex: this.playbackIndex
        };
        this.player = new PlayerControl(options);
        console.log('this.player',this.player)
        this.player.on('PlayStart', (e) => {
            //@ts-ignore
            this.dispatch(EventEnum.PLAY,{type:'PlayStart',target:this})
            console.log('PlayStart', e);
            if (!this.player.isPlayback) {
            }
        });
        this.player.on('Error',  (e)=> {
            console.log('Error: ' + JSON.stringify(e))
            //@ts-ignore
            this.dispatch(EventEnum.ERROR,{type:'Error',code:''})
        });
        this.player.on('WorkerReady', (ev) => {
            //@ts-ignore
            this.dispatch(EventEnum.READY,{type:'WorkerReady',target:this})
            console.log('准备好了   开始链接播放..', ev)
            this.player.connect();
        });
        console.log('this.', this)
        this.player.init(this.canvasEl, this.videoEl)
    }

    dispose() {
        //@ts-ignore
        this.dispatch(EventEnum.DISPOSE,{type:'dispose',target:this})
        this.player && this.player?.stop?.()
        this.player && this.player?.close?.()
        this.removeEl()
        this.player = null;
    }
}
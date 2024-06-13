import VideoControl, {VideoBaseOpt} from '../abstract/VideoControl';
import {EventEnum} from "../enums/CommonEnum";

interface IHikvision {
   elId:string,
   width:number,
   height:number,
   szBasePath:string
}

type HikvisionOpt = Partial<VideoBaseOpt> & IHikvision

const DEF:Partial<HikvisionOpt> = {
  ip:'172.168.1.247',
  port:80,
  username:'admin',
  password:'admin123',
  channel:1,
  streamType:1,

  width:600,
  height:400,
  elId:'divPlugin',
  szBasePath: "libs/hikvision/",
}
declare let WebVideoCtrl:any;
export default class Hikvision extends VideoControl{
  public width:number;
  public height:number;
  public elId:string;
  public container:any;
  public szBasePath:string;
  constructor(opts:Partial<HikvisionOpt>) {
    const def = {...DEF,...opts}
    super(def)
    this.isPlayback = false;
    this.playbackIndex = 0;
    this.needPlugin = true;
    this.needLogin = true;
    console.log('WebVideoCtrl 海康',WebVideoCtrl)

    this.width = def.width;
    this.height = def.height;
    this.elId = def.elId;
    this.szBasePath = def.szBasePath;
    this.generateEl()
    //初始化或者检测插件是否安装
    if (this.needPlugin){
      let install = this.checkPlugin();
      if (install){
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin(this.width,this.height,{
          szBasePath: this.szBasePath,
          bWndFull: false,//是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
          iWndowType: 1,
          cbSelWnd: function (xmlDoc) {
            console.log('当前选择的窗口编号',xmlDoc)
          },
          cbDoubleClickWnd: function (iWndIndex, bFullScreen) {
            console.log('当前放大的窗口编号')
          },
          cbEvent: function (iEventType, iParam1, iParam2) {
            console.log('回看')
          },
          cbInitPluginComplete:  ()=> {
            WebVideoCtrl.I_InsertOBJECTPlugin(this.pluginElId);
            // 检查插件是否最新
            if (-1 == WebVideoCtrl.I_CheckPluginVersion()) {
              alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
              return;
            }
            this.login()
          }
        });
      }
    }
  }

  get pluginElId(){
    return  `divPlugin${this.elId}`
  }

  generateEl(){
    this.container = document.createElement('div');
    this.container.style.cssText =`width: ${this.width ?? '100%'};height: ${this.height ?? '100%'};`
    this.container.setAttribute('id', this.pluginElId);
    if (this.wrapEl) {
      this.wrapEl.appendChild(this.container)
    }
  }

  removeEl(){
    const remove = (el)=>{
      let parent = el?.parentNode
      if (parent) {
        parent.removeChild(el)
      }
    }
    remove(this.container);
    this.container = null;
  }

  checkPlugin(){
    let iRet = WebVideoCtrl.I_CheckPluginInstall();
    console.log('iRet',iRet)
    if (-1 == iRet) {
      //@ts-ignore
      this.dispatch(EventEnum.PLUGIN,{type:'Plugin',target:this,msg:'插件初始化失败，请确认是否已安装插件；如果未安装，请双击开发包目录里的HCWebSDKPlugin.exe安装！'})
      console.log('您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！')
      return false;
    }
    return  true

  }
  play() {
    let oWndInfo = WebVideoCtrl?.I_GetWindowStatus(0);
    const startRealPlay =  ()=> {
      WebVideoCtrl.I_StartRealPlay(this.identify, {
        iStreamType: this.streamType,
        iChannelID: this.channel,
        // bZeroChannel: bZeroChannel,
        success:  ()=> {
          //@ts-ignore
          this.dispatch(EventEnum.PLAY,{type:'PlayStart',target:this})
          console.log('开始预览成功')
        },
        error:  (oError)=> {
          console.log('开始预览失败',oError)
          //@ts-ignore
          this.dispatch(EventEnum.ERROR,{type:'Error',code:''})
        }
      });
    };
    if (oWndInfo != null) {// 已经在播放了，先停止
      WebVideoCtrl.I_Stop({
        success:   ()=> {
          startRealPlay();
        }
      });
    } else {
      startRealPlay();
    }
  }
  stop() {
    let oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);
    if (oWndInfo != null) {
      WebVideoCtrl.I_Stop({
        success:  ()=> {
          //@ts-ignore
          this.dispatch(EventEnum.PAUSE,{type:'PlayStart',target:this})
          console.log('停止预览成功')
        },
        error:  (oError)=> {
          console.log('停止预览失败')
          //@ts-ignore
          this.dispatch(EventEnum.ERROR,{type:'Error',code:''})
        }
      });
    }

  }
  dispose() {
    WebVideoCtrl.I_Stop();
    WebVideoCtrl.I_DestroyPlugin();
    this.logout()
    this.removeEl()
    //@ts-ignore
    this.dispatch(EventEnum.DISPOSE,{type:'PlayStart',target:this})
  }
  login() {
    const {ip,port,username,password} = this;
    WebVideoCtrl?.I_Login(ip, 1, port, username, password, {
      timeout: 3000,
      success:  (xmlDoc)=> {
        console.log('登录成功',xmlDoc)
        this.play()
      },
      error:  (oError)=> {
        console.log('登录失败',oError)
        //@ts-ignore
        this.dispatch(EventEnum.ERROR,{type:'Error',code:''})
      }
    });


  }
  logout() {
    WebVideoCtrl?.I_Logout(this.identify).then(() => {
      console.log('退出成功')
    }, () => {
      console.log('退出失败')
      //@ts-ignore
      this.dispatch(EventEnum.ERROR,{type:'Error',code:''})
    });
  }
  fullScreen(flag:boolean){
    WebVideoCtrl.I_FullScreen(flag);
  }
  downloadPlugin(){
    //@ts-ignore
    const fileUrl =   this.szBasePath + 'WebComponentsKit.exe'; // 文件的相对路径
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'WebComponentsKit.exe'; // 下载文件的名称
    link.click();
  }
}

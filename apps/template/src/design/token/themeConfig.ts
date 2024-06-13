import {Theme} from "/#/global";

import fourPng from "/@/assets/images/theme/four.png";
import floodPng from "/@/assets/images/theme/flood.png";

const PRIMARY_COLOR_KEY = `--ec-primary-color-6`

const themeConfig :Array<Theme> = [
    {
        themeNameCh: '洪水预报',
        themeNameEn: 'flood',
        default: true,
        primaryColor:PRIMARY_COLOR_KEY,
        thumbnail:floodPng,
        colors: {
           //主色 primary
            '--ec-primary-color-1': '#E5FBF6',
            '--ec-primary-color-2': '#CDF9EE',
            '--ec-primary-color-3': '#9DF3E6',
            '--ec-primary-color-4': '#68DDD4',
            '--ec-primary-color-5': '#3FBBBB',
            '--ec-primary-color-6': '#11848F',
            '--ec-primary-color-7': '#0C687A',
            '--ec-primary-color-8': '#084F66',
            '--ec-primary-color-9': '#053952',
            '--ec-primary-color-10': '#032944',
            '--ec-primary-color-11': 'linear-gradient(180deg, #11848F 47%, #0C687A 49%)',
            '--ec-primary-color-12': 'linear-gradient(90deg,#125580 2%, #36B77C 100%)',
            '--ec-primary-color-13': 'linear-gradient(90deg, #125580 9%, #36B77C 53%, #125580 90%)',
//功能色 secondary
            '--ec-secondary-color-1': '#EBF5FF',
            '--ec-secondary-color-2': '#B6DDFF',
            '--ec-secondary-color-3': '#84C5FF',
            '--ec-secondary-color-4': '#58B0FF',
            '--ec-secondary-color-5': '#349FFF',
            '--ec-secondary-color-6': '#1791FF',
            '--ec-secondary-color-7': '#0C76D6',
            '--ec-secondary-color-8': '#065DAB',
            '--ec-secondary-color-9': '#054680',
            '--ec-secondary-color-10': '#043259',
//错误色 error
            '--ec-error-color-1': '#fff0ed',
            '--ec-error-color-2': '#ffd8d2',
            '--ec-error-color-3': '#ffb9b0',
            '--ec-error-color-4': '#ff9285',
            '--ec-error-color-5': '#f6685d',
            '--ec-error-color-6': '#d54941',
            '--ec-error-color-7': '#ad352f',
            '--ec-error-color-8': '#881f1c',
            '--ec-error-color-9': '#68070a',
            '--ec-error-color-10': '#490002',
//告警色 warning
            '--ec-warning-color-1': '#fff1e9',
            '--ec-warning-color-2': '#ffd9c2',
            '--ec-warning-color-3': '#ffb98c',
            '--ec-warning-color-4': '#fa9550',
            '--ec-warning-color-5': '#e37318',
            '--ec-warning-color-6': '#be5a00',
            '--ec-warning-color-7': '#954500',
            '--ec-warning-color-8': '#713300',
            '--ec-warning-color-9': '#532300',
            '--ec-warning-color-10': '#3b1700',
//成功色 success
            '--ec-success-color-1': '#e3f9e9',
            '--ec-success-color-2': '#c6f3d7',
            '--ec-success-color-3': '#92dab2',
            '--ec-success-color-4': '#56c08d',
            '--ec-success-color-5': '#2ba471',
            '--ec-success-color-6': '#008858',
            '--ec-success-color-7': '#006c45',
            '--ec-success-color-8': '#005334',
            '--ec-success-color-9': '#003b23',
            '--ec-success-color-10': '#002515',
//中性色
            '--ec-neutral-color-1': '#F3F3F3',
            '--ec-neutral-color-2': '#EEEEEE',
            '--ec-neutral-color-3': '#E7E7E7',
            '--ec-neutral-color-4': '#DCDCDC',
            '--ec-neutral-color-5': '#C5C5C5',
            '--ec-neutral-color-6': '#A6A6A6',
            '--ec-neutral-color-7': '#8B8B8B',
            '--ec-neutral-color-8': '#777777',
            '--ec-neutral-color-9': '#5E5E5E',
            '--ec-neutral-color-10': '#4B4B4B',
            '--ec-neutral-color-11': '#383838',
            '--ec-neutral-color-12': '#2C2C2C',
            '--ec-neutral-color-13': '#242424',
            //字体颜色
            '--ec-font-dark-1':'#000000',//强调/主要文字
            '--ec-font-dark-2':'#424242',//次强调文字
            '--ec-font-dark-3':'#757575',//次要信息文字
            '--ec-font-dark-4':'#B2B2B2',//辅助文字1
            '--ec-font-dark-5':'#DBDBDB',//辅助文字2

            '--ec-font-normal-1':'#64B5F6',
            '--ec-font-normal-2':'#2196F3',//浅色链接、提示文字、一般状态
            '--ec-font-normal-3':'#1976D2',//深色链接文字

            '--ec-font-error':'#F44336',//错误状态文字
            '--ec-font-warning':'#F2973D',//告警提醒状态文字
            '--ec-font-success':'#4CAF50',//成功提示文字

            '--ec-font-primary-1':'#68DDD4',
            '--ec-font-primary-2':'#11848F',//表头文字、主色按钮文字
            '--ec-font-primary-3':'#125580',//小标题文字

            '--ec-font-white-1':'#FFFFFF',//白色主要文字
            '--ec-font-white-2':'rgba(255, 255, 255, 0.55)',
            '--ec-font-white-3':'rgba(255, 255, 255, 0.35)',
            '--ec-font-white-4':'rgba(255, 255, 255, 0.2)',

        }
    },
    {
        themeNameCh: '四预系统',
        themeNameEn: 'four',
        default: false,
        primaryColor:PRIMARY_COLOR_KEY,
        thumbnail:fourPng,
        colors: {
            //主色 primary
            '--ec-primary-color-1': '#EBF1FF',
            '--ec-primary-color-2': '#BCD0FF',
            '--ec-primary-color-3': '#8FB0FF',
            '--ec-primary-color-4': '#6895FF',
            '--ec-primary-color-5': '#4A7FFF',
            '--ec-primary-color-6': '#326EFF',
            '--ec-primary-color-7': '#1D53D6',
            '--ec-primary-color-8': '#0F3DAB',
            '--ec-primary-color-9': '#082B80',
            '--ec-primary-color-10': '#041D59',
            '--ec-primary-color-11': 'linear-gradient(270deg, #1D53D6 0%, #8FB0FF 100%)',
            '--ec-primary-color-12': 'linear-gradient(90deg, #326EFF 2%, #6895FF 100%)',
            '--ec-primary-color-13': 'linear-gradient(90deg, #285CDA 3%, #81A4FA 51%, #285CDB 99%)',
//功能色 secondary
            '--ec-secondary-color-1': '#EBF5FF',
            '--ec-secondary-color-2': '#B6DDFF',
            '--ec-secondary-color-3': '#84C5FF',
            '--ec-secondary-color-4': '#58B0FF',
            '--ec-secondary-color-5': '#349FFF',
            '--ec-secondary-color-6': '#1791FF',
            '--ec-secondary-color-7': '#0C76D6',
            '--ec-secondary-color-8': '#065DAB',
            '--ec-secondary-color-9': '#054680',
            '--ec-secondary-color-10': '#043259',
//错误色 error
            '--ec-error-color-1': '#fff0ed',
            '--ec-error-color-2': '#ffd8d2',
            '--ec-error-color-3': '#ffb9b0',
            '--ec-error-color-4': '#ff9285',
            '--ec-error-color-5': '#f6685d',
            '--ec-error-color-6': '#d54941',
            '--ec-error-color-7': '#ad352f',
            '--ec-error-color-8': '#881f1c',
            '--ec-error-color-9': '#68070a',
            '--ec-error-color-10': '#490002',
//告警色 warning
            '--ec-warning-color-1': '#fff1e9',
            '--ec-warning-color-2': '#ffd9c2',
            '--ec-warning-color-3': '#ffb98c',
            '--ec-warning-color-4': '#fa9550',
            '--ec-warning-color-5': '#e37318',
            '--ec-warning-color-6': '#be5a00',
            '--ec-warning-color-7': '#954500',
            '--ec-warning-color-8': '#713300',
            '--ec-warning-color-9': '#532300',
            '--ec-warning-color-10': '#3b1700',
//成功色 success
            '--ec-success-color-1': '#e3f9e9',
            '--ec-success-color-2': '#c6f3d7',
            '--ec-success-color-3': '#92dab2',
            '--ec-success-color-4': '#56c08d',
            '--ec-success-color-5': '#2ba471',
            '--ec-success-color-6': '#008858',
            '--ec-success-color-7': '#006c45',
            '--ec-success-color-8': '#005334',
            '--ec-success-color-9': '#003b23',
            '--ec-success-color-10': '#002515',
//中性色
            '--ec-neutral-color-1': '#F3F3F3',
            '--ec-neutral-color-2': '#EEEEEE',
            '--ec-neutral-color-3': '#E7E7E7',
            '--ec-neutral-color-4': '#DCDCDC',
            '--ec-neutral-color-5': '#C5C5C5',
            '--ec-neutral-color-6': '#A6A6A6',
            '--ec-neutral-color-7': '#8B8B8B',
            '--ec-neutral-color-8': '#777777',
            '--ec-neutral-color-9': '#5E5E5E',
            '--ec-neutral-color-10': '#4B4B4B',
            '--ec-neutral-color-11': '#383838',
            '--ec-neutral-color-12': '#2C2C2C',
            '--ec-neutral-color-13': '#242424',

            //字体颜色
            '--ec-font-dark-1':'#000000',//强调/主要文字
            '--ec-font-dark-2':'#424242',//次强调文字
            '--ec-font-dark-3':'#757575',//次要信息文字
            '--ec-font-dark-4':'#B2B2B2',//辅助文字1
            '--ec-font-dark-5':'#DBDBDB',//辅助文字2

            '--ec-font-normal-1':'#64B5F6',
            '--ec-font-normal-2':'#2196F3',//浅色链接、提示文字、一般状态
            '--ec-font-normal-3':'#1976D2',//深色链接文字

            '--ec-font-error':'#F44336',//错误状态文字
            '--ec-font-warning':'#F2973D',//告警提醒状态文字
            '--ec-font-success':'#4CAF50',//成功提示文字

            '--ec-font-primary-1':'#8CCEF5',
            '--ec-font-primary-2':'#0885EC',//表头文字、主色按钮文字
            '--ec-font-primary-3':'#004EA1',//小标题文字

            '--ec-font-white-1':'#FFFFFF',//白色主要文字
            '--ec-font-white-2':'rgba(255, 255, 255, 0.55)',
            '--ec-font-white-3':'rgba(255, 255, 255, 0.35)',
            '--ec-font-white-4':'rgba(255, 255, 255, 0.2)',
        }
    }
];
/** 获取默认的主题*/
export const getDefaultTheme = ():Theme=>{
    let theme:Theme =  JSON.parse(JSON.stringify(themeConfig.find((t)=>t.default) ?? {}));
    theme.primaryColor = theme?.colors?.[theme?.primaryColor];
    console.log('theme',theme)
    return theme;
}

/** 查找主题*/
export const getTheme = (name:string) :Theme=>{
    let theme:Theme =  JSON.parse(JSON.stringify(themeConfig.find((t)=>t.themeNameEn == name) ?? {}));
    theme.primaryColor = theme?.colors?.[theme?.primaryColor];
    return theme;
}


/** 获取已经配置的所有主题*/
export const getThemes = () => {
  return themeConfig.map((t)=>{
      console.log('t',t)
      return {
          themeNameCh:t.themeNameCh,
          themeNameEn:t.themeNameEn,
          primaryColor: t.colors[t.primaryColor],
          thumbnail: t.thumbnail,
          default:t.default
      }
  });
}
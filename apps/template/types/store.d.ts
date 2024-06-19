import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import {WindowPiniaPlugin} from "/@/store/plugins/window.plugin.ts";
import {BoardPiniaPlugin} from "/@/store/plugins/board.plugin.ts";
import {GetUserInfoModel, LoginResultModel} from "@/api/model/user.model.ts";

export type  LoginInfo = LoginResultModel;
// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export type UserInfo = GetUserInfoModel;

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    window:WindowPiniaPlugin
    board:BoardPiniaPlugin
  }
}
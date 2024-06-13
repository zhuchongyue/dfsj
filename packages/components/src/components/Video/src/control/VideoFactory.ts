import {VideoType} from "../enums/CommonEnum";
import DaHua from "./DaHua"
import Hikvision from "./Hikvision"

export default class VideoFactory{
    static create( type , options){
        let coach = null;
        switch (type) {
            case VideoType.DaHua:
            coach = DaHua;
            break;
            case VideoType.Hikvision:
                coach = Hikvision;
                break;
            default:
                coach = null;
                break;
        }
        if (coach) return new coach(options)
    }


}
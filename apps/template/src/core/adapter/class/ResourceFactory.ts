import {GisPlatformEnum} from "@/enums/appEnum.ts";
import {CesiumResourceImpl} from "@/core/adapter/impl/CesiumResourceImpl.ts";
import {OlResourceImpl} from "@/core/adapter/impl/OlResourceImpl.ts";

export default class ResourceFactory {


  static createResource(platform:GisPlatformEnum){
    let factory:any = null;
    switch(platform){
      case GisPlatformEnum.CESIUM:
        factory = CesiumResourceImpl;
        break;
        case GisPlatformEnum.OPENLAYERS:
         factory = OlResourceImpl;
    }
    return factory;
  }
}
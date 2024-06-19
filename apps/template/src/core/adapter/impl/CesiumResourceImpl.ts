import {AbstractResource} from "@/core/adapter/impl/AbstractResource.ts";

export class CesiumResourceImpl extends  AbstractResource{
    constructor(id: any, config: any, dataSource?: [] = []) {
        super(id, config, dataSource);
    }
}
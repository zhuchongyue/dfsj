import {Geometry} from 'ol/geom'
import {Style as olStyle} from 'ol/style'
import StyleFactory from './StyleFactory'

export default class Style {
    /** 创建样式*/
    static create(options, attributes?) {
        let option = options && typeof options === 'object' ? options : {}
        let style = new olStyle({});
        if (option['geometry'] && option['geometry'] instanceof Geometry) {
            style.setGeometry(option['geometry'])
        }
        if (option['zIndex'] && typeof option['zIndex'] === 'number') {
            style.setZIndex(option['zIndex'])
        }
        if (option['fill'] && typeof option['fill'] === 'object') {
            style.setFill(StyleFactory.getFill(option['fill'], attributes))
        }
        if (option['image'] && typeof option['image'] === 'object') {
            style.setImage(StyleFactory.getImage(option['image'], attributes))
        }
        if (option['stroke'] && typeof option['stroke'] === 'object') {
            style.setStroke(StyleFactory.getStroke(option['stroke'], attributes))
        }
        // if (option['text'] && typeof option['text'] === 'object') {
        // 	style.setText(StyleFactory.getText(option['text'], attributes))
        // }
        let styles = [];
        if (option['text']) {
            if (Array.isArray(option['text'])) {
                styles = (option['text'].map(e => {
                    let textStyle = new olStyle({})
                    textStyle.setText(StyleFactory.getText(e, attributes))
                    return textStyle;
                }));
            }else{
                style.setText(StyleFactory.getText(option['text'], attributes))
            }
        };
        return styles?.length ? [style].concat([...styles]) : style;
    }
}

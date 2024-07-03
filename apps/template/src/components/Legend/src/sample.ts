const legendSampleArray = [{
    "name": "降水(mm)",
    "items": [
        {
            "style": "color:#A6F28E",
            "label": "0.1～10",
            "value": "0"
        },
        {
            "style": "color:#3DB93F",
            "label": "10～25",
            "value": "10"
        },
        {
            "style": "color:#61B8FF",
            "label": "25～50",
            "value": "25"
        },
        {
            "style": "color:#0100E2",
            "label": "50～100",
            "value": "50"
        },
        {
            "style": "color:#FA00FA",
            "label": "100～250",
            "value": "100"
        },
        {
            "style": "color:#810040",
            "label": ">=250",
            "value": "250"
        }
    ],
    "index": 0,
    "styletype": null
}]

const legendSample = {

    id: '',
    name: "text",
    index: 1,         // default item index !!not item value!!
    items: [
        {
            label: "100mm", // legend label
            style: "color:#A6F28E",   // legend color, css color
            value: 100      // legend value
        },
        {
            label: "80mm",
            style: "color:#A6F28E",
            value: 80
        },
        {
            label: "50mm",
            style: "color:#A6F28E",
            value: 50
        },
        {
            label: "0mm",
            style: "color:#A6F28E",
            value: 0
        },
    ]
}


export {
    legendSample,
    legendSampleArray
}
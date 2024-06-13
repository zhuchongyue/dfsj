

const players = [
    {
        "id": 176,
        "module": 1,
        "datatype": "rain_all",
        "name": "rain_all",
        "icon": null,
        "checked": 1,
        "level": 3,
        "pid": 18,
        "ordernum": 1,
        "configure": null,
        "sourcetype": 1,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": {
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
            "styletype": null,
            "legendtype": null,
            "img": null
        },
        "export": 0,
        "motype": 4,
        "model": null,
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": "rain_all_interval",
        "label": "实时雨情",
        "anytimeable": "rain_all_anytime",
        "dailyable": 1,
        "hourable": null,
        "lines": 0,
        "typeid": 18,
        "typenum": 1,
        "typename": "雨情信息"
    },
    {
        "id": 431,
        "module": 1,
        "datatype": "rain",
        "name": "rain",
        "icon": null,
        "checked": 0,
        "level": 3,
        "pid": 18,
        "ordernum": 3,
        "configure": null,
        "sourcetype": 2,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": {
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
            "styletype": null,
            "legendtype": null,
            "img": null
        },
        "export": 0,
        "motype": null,
        "model": "1",
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": "",
        "label": "气象预报",
        "anytimeable": null,
        "dailyable": 1,
        "hourable": null,
        "lines": 0,
        "typeid": 18,
        "typenum": 3,
        "typename": "雨情信息"
    },
    {
        "id": 278,
        "module": 1,
        "datatype": "dbz",
        "name": "dbz",
        "icon": null,
        "checked": 0,
        "level": 4,
        "pid": 18,
        "ordernum": 5,
        "configure": null,
        "sourcetype": 1,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": {
            "name": "基本反射率dbZ",
            "items": [
                {
                    "style": "color:#00A1F6",
                    "label": "10",
                    "value": "10"
                },
                {
                    "style": "color:#00EDED",
                    "label": "15",
                    "value": "15"
                },
                {
                    "style": "color:#00D900",
                    "label": "20",
                    "value": "20"
                },
                {
                    "style": "color:#009100",
                    "label": "25",
                    "value": "25"
                },
                {
                    "style": "color:#FFFF00",
                    "label": "30",
                    "value": "30"
                },
                {
                    "style": "color:#E8C100",
                    "label": "35",
                    "value": "35"
                },
                {
                    "style": "color:#FF9100",
                    "label": "40",
                    "value": "40"
                },
                {
                    "style": "color:#FF0000",
                    "label": "45",
                    "value": "45"
                },
                {
                    "style": "color:#D71400",
                    "label": "50",
                    "value": "50"
                },
                {
                    "style": "color:#C20000",
                    "label": "55",
                    "value": "55"
                },
                {
                    "style": "color:#FF00F0",
                    "label": "60",
                    "value": "60"
                },
                {
                    "style": "color:#9700B5",
                    "label": "65",
                    "value": "65"
                },
                {
                    "style": "color:#AE91F0",
                    "label": "70",
                    "value": "70"
                }
            ],
            "index": 0,
            "styletype": null,
            "legendtype": null,
            "img": null
        },
        "export": 0,
        "motype": null,
        "model": null,
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": null,
        "label": "雷达回波",
        "anytimeable": null,
        "dailyable": 0,
        "hourable": null,
        "lines": 0,
        "typeid": 18,
        "typenum": 5,
        "typename": "雨情信息"
    },
    {
        "id": 446,
        "module": 1,
        "datatype": "dbz_gz",
        "name": "dbz_gz",
        "icon": null,
        "checked": 0,
        "level": 4,
        "pid": 18,
        "ordernum": 6,
        "configure": null,
        "sourcetype": 1,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": {
            "name": "基本反射率dbz",
            "items": [
                {
                    "style": "color:#AF23FF",
                    "label": "70",
                    "value": "70"
                },
                {
                    "style": "color:#D78DFF",
                    "label": "65",
                    "value": "65"
                },
                {
                    "style": "color:#F10130",
                    "label": "60",
                    "value": "60"
                },
                {
                    "style": "color:#FF634E",
                    "label": "55",
                    "value": "55"
                },
                {
                    "style": "color:#FFAFAE",
                    "label": "50",
                    "value": "50"
                },
                {
                    "style": "color:#8E8E08",
                    "label": "45",
                    "value": "45"
                },
                {
                    "style": "color:#CECC00",
                    "label": "40",
                    "value": "40"
                },
                {
                    "style": "color:#FDF765",
                    "label": "35",
                    "value": "35"
                },
                {
                    "style": "color:#0F9319",
                    "label": "30",
                    "value": "30"
                },
                {
                    "style": "color:#03E903",
                    "label": "25",
                    "value": "25"
                },
                {
                    "style": "color:#A6FDAE",
                    "label": "20",
                    "value": "20"
                },
                {
                    "style": "color:#1824DA",
                    "label": "15",
                    "value": "15"
                },
                {
                    "style": "color:#7A70ED",
                    "label": "10",
                    "value": "10"
                },
                {
                    "style": "color:#C9C4FE",
                    "label": "5",
                    "value": "5"
                }
            ],
            "index": 0,
            "styletype": null,
            "legendtype": null,
            "img": null
        },
        "export": 0,
        "motype": null,
        "model": null,
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": null,
        "label": "测雨雷达",
        "anytimeable": null,
        "dailyable": 0,
        "hourable": null,
        "lines": 0,
        "typeid": 18,
        "typenum": 6,
        "typename": "雨情信息"
    },
    {
        "id": 279,
        "module": 1,
        "datatype": "salitate",
        "name": "salitate",
        "icon": null,
        "checked": 0,
        "level": 4,
        "pid": 18,
        "ordernum": 7,
        "configure": null,
        "sourcetype": 2,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": null,
        "export": 0,
        "motype": null,
        "model": "4",
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": null,
        "label": "卫星云图",
        "anytimeable": null,
        "dailyable": 0,
        "hourable": null,
        "lines": 0,
        "typeid": 18,
        "typenum": 6,
        "typename": "雨情信息"
    },
    {
        "id": 158,
        "module": 1,
        "datatype": "weather",
        "name": "weather",
        "icon": null,
        "checked": 0,
        "level": 4,
        "pid": 18,
        "ordernum": 8,
        "configure": null,
        "sourcetype": 0,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": null,
        "export": 0,
        "motype": 427,
        "model": null,
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": null,
        "label": "天气预报",
        "anytimeable": null,
        "dailyable": 0,
        "hourable": null,
        "lines": 0,
        "typeid": null,
        "typenum": 7,
        "typename": null
    },
    {
        "id": 441,
        "module": 1,
        "datatype": "rain_pa",
        "name": "rain_pa",
        "icon": null,
        "checked": 0,
        "level": 3,
        "pid": 18,
        "ordernum": 10,
        "configure": null,
        "sourcetype": 1,
        "playable": 1,
        "formable": 1,
        "fileable": 0,
        "legend": {
            "name": "前期影响雨量(mm)",
            "items": [
                {
                    "style": "color:#CEED00",
                    "label": "<10",
                    "value": "0"
                },
                {
                    "style": "color:#A6F28E",
                    "label": "10～30",
                    "value": "10"
                },
                {
                    "style": "color:#3DB93F",
                    "label": "30～50",
                    "value": "30"
                },
                {
                    "style": "color:#61B8FF",
                    "label": "50～70",
                    "value": "50"
                },
                {
                    "style": "color:#0100E2",
                    "label": "70～90",
                    "value": "70"
                }
            ],
            "index": 0,
            "styletype": null,
            "legendtype": null,
            "img": null
        },
        "export": 0,
        "motype": null,
        "model": "1",
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": null,
        "label": "前期影响雨量",
        "anytimeable": null,
        "dailyable": 1,
        "hourable": null,
        "lines": 0,
        "typeid": 18,
        "typenum": 8,
        "typename": "雨情信息"
    },
    {
        "id": 393,
        "module": 1,
        "datatype": "temp",
        "name": "temp",
        "icon": null,
        "checked": 0,
        "level": 2,
        "pid": 18,
        "ordernum": 20,
        "configure": null,
        "sourcetype": 0,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": {
            "name": "图例(℃)",
            "items": [
                {
                    "style": "color:#201D94",
                    "label": "<-30",
                    "value": "-100"
                },
                {
                    "style": "color:#293AC4",
                    "label": "-30~-25",
                    "value": "-30"
                },
                {
                    "style": "color:#2F66D5",
                    "label": "-25~-20",
                    "value": "-25"
                },
                {
                    "style": "color:#428EF4",
                    "label": "-20~-15",
                    "value": "-20"
                },
                {
                    "style": "color:#6BB5F6",
                    "label": "-15~-10",
                    "value": "-15"
                },
                {
                    "style": "color:#99CDF4",
                    "label": "-10~-5",
                    "value": "-10"
                },
                {
                    "style": "color:#C0E6F9",
                    "label": "-5~0",
                    "value": "-5"
                },
                {
                    "style": "color:#E9FEFF",
                    "label": "0~5",
                    "value": "0"
                },
                {
                    "style": "color:#FDFFC9",
                    "label": "5~10",
                    "value": "5"
                },
                {
                    "style": "color:#F9F2A1",
                    "label": "10~15",
                    "value": "10"
                },
                {
                    "style": "color:#FCE779",
                    "label": "15~20",
                    "value": "15"
                },
                {
                    "style": "color:#FDCF50",
                    "label": "20~25",
                    "value": "20"
                },
                {
                    "style": "color:#F09E04",
                    "label": "25~30",
                    "value": "25"
                },
                {
                    "style": "color:#EF7A08",
                    "label": "30~35",
                    "value": "30"
                },
                {
                    "style": "color:#E7501C",
                    "label": "35~40",
                    "value": "35"
                },
                {
                    "style": "color:#A90F0E",
                    "label": "40~45",
                    "value": "40"
                },
                {
                    "style": "color:#660316",
                    "label": "45~50",
                    "value": "45"
                },
                {
                    "style": "color:#47020D",
                    "label": ">50",
                    "value": "50"
                }
            ],
            "index": 0,
            "styletype": null,
            "legendtype": null,
            "img": null
        },
        "export": 0,
        "motype": null,
        "model": null,
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": "0",
        "label": "温度",
        "anytimeable": "0",
        "dailyable": 0,
        "hourable": null,
        "lines": 0,
        "typeid": null,
        "typenum": 7,
        "typename": null
    },
    {
        "id": 394,
        "module": 1,
        "datatype": "humidity",
        "name": "humidity",
        "icon": null,
        "checked": 0,
        "level": 2,
        "pid": 18,
        "ordernum": 21,
        "configure": null,
        "sourcetype": 1,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": {
            "name": "相对湿度(%)",
            "items": [
                {
                    "style": "color:#063060",
                    "label": "90~100",
                    "value": "999"
                },
                {
                    "style": "color:#1F62AC",
                    "label": "80~90",
                    "value": "90"
                },
                {
                    "style": "color:#4394C3",
                    "label": "70~80",
                    "value": "80"
                },
                {
                    "style": "color:#7FBAD9",
                    "label": "60~70",
                    "value": "70"
                },
                {
                    "style": "color:#BDDEF0",
                    "label": "50~60",
                    "value": "60"
                },
                {
                    "style": "color:#FEDF8F",
                    "label": "40~50",
                    "value": "50"
                },
                {
                    "style": "color:#FFC350",
                    "label": "30~40",
                    "value": "40"
                },
                {
                    "style": "color:#FF9A2A",
                    "label": "20~30",
                    "value": "30"
                },
                {
                    "style": "color:#EA7115",
                    "label": "10~20",
                    "value": "20"
                },
                {
                    "style": "color:#983200",
                    "label": "0~10",
                    "value": "10"
                }
            ],
            "index": 0,
            "styletype": null,
            "legendtype": null,
            "img": null
        },
        "export": 0,
        "motype": null,
        "model": null,
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": "0",
        "label": "湿度",
        "anytimeable": "0",
        "dailyable": 1,
        "hourable": null,
        "lines": 0,
        "typeid": null,
        "typenum": 8,
        "typename": null
    },
    {
        "id": 392,
        "module": 1,
        "datatype": "wind",
        "name": "wind",
        "icon": null,
        "checked": 0,
        "level": 2,
        "pid": 18,
        "ordernum": 22,
        "configure": null,
        "sourcetype": 0,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": {
            "name": "风速(m/s)",
            "items": [
                {
                    "style": "color:#6271B8",
                    "label": "0~1.5",
                    "value": "0"
                },
                {
                    "style": "color:#3D6EA3",
                    "label": "1.5~3.0",
                    "value": "1.5"
                },
                {
                    "style": "color:#4A94AA",
                    "label": "3.0~4.5",
                    "value": "3.0"
                },
                {
                    "style": "color:#4A9294",
                    "label": "4.5~6",
                    "value": "4.5"
                },
                {
                    "style": "color:#4D8E7C",
                    "label": "6~7.5",
                    "value": "7.5"
                },
                {
                    "style": "color:#4CA44C",
                    "label": "7.5~10",
                    "value": "7.5"
                },
                {
                    "style": "color:#67A436",
                    "label": "10~12.5",
                    "value": "10"
                },
                {
                    "style": "color:#A28740",
                    "label": "12.5~15",
                    "value": "12.5"
                },
                {
                    "style": "color:#8D3F5C",
                    "label": "15~17.5",
                    "value": "15"
                },
                {
                    "style": "color:#974B91",
                    "label": "17.5~20",
                    "value": "17.5"
                },
                {
                    "style": "color:#5F64A0",
                    "label": "20~25",
                    "value": "20"
                },
                {
                    "style": "color:#5B88A1",
                    "label": "25~30",
                    "value": "25"
                },
                {
                    "style": "color:#5B88A1",
                    "label": ">=30",
                    "value": "30"
                }
            ],
            "index": 0,
            "styletype": null,
            "legendtype": null,
            "img": null
        },
        "export": 0,
        "motype": null,
        "model": null,
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": "0",
        "label": "动态风场",
        "anytimeable": "0",
        "dailyable": 1,
        "hourable": null,
        "lines": 0,
        "typeid": null,
        "typenum": 6,
        "typename": null
    }
]

const rsvrPlayer = [
    {
        "id": 109,
        "module": 1,
        "datatype": "rsvr",
        "name": "rsvr",
        "icon": null,
        "checked": 1,
        "level": 2,
        "pid": 409,
        "ordernum": 1,
        "configure": null,
        "sourcetype": 5,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": {
            "name": "图例",
            "items": [
                {
                    "style": "image:images/layer/1/431-0.png",
                    "label": "所有站点",
                    "value": "0"
                },
                {
                    "style": "image:images/layer/1/431-4.png",
                    "label": "超汛限水位",
                    "value": "4"
                },
                {
                    "style": "image:images/layer/1/431-3.png",
                    "label": "超正常水位",
                    "value": "3"
                },
                {
                    "style": "image:images/layer/1/431-2.png",
                    "label": "超设计水位",
                    "value": "2"
                }
            ],
            "index": 0,
            "styletype": null,
            "legendtype": null,
            "img": null
        },
        "export": 0,
        "motype": 1,
        "model": "4",
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": "rsvr_interval",
        "label": "水库水情",
        "anytimeable": "rsvr_anytime",
        "dailyable": 1,
        "hourable": null,
        "lines": 0,
        "typeid": 409,
        "typenum": 3,
        "typename": "水情信息"
    },
    {
        "id": 421,
        "module": 1,
        "datatype": "rsvr_capacity",
        "name": "rsvr_capacity",
        "icon": null,
        "checked": 0,
        "level": 2,
        "pid": 409,
        "ordernum": 2,
        "configure": null,
        "sourcetype": 5,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": null,
        "export": 0,
        "motype": 1,
        "model": "4",
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": "",
        "label": "工程蓄水",
        "anytimeable": "",
        "dailyable": 1,
        "hourable": null,
        "lines": 0,
        "typeid": 409,
        "typenum": 4,
        "typename": "水情信息"
    },
    {
        "id": 454,
        "module": 1,
        "datatype": "module_id_454",
        "name": "listen_id_454",
        "icon": null,
        "checked": 0,
        "level": 2,
        "pid": 409,
        "ordernum": 3,
        "configure": null,
        "sourcetype": 1,
        "playable": 0,
        "formable": 0,
        "fileable": 0,
        "legend": null,
        "export": 0,
        "motype": 15,
        "model": "4",
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": "",
        "label": "水库纳雨",
        "anytimeable": "",
        "dailyable": 1,
        "hourable": null,
        "lines": 0,
        "typeid": 409,
        "typenum": 5,
        "typename": "水情信息"
    },
    {
        "id": 108,
        "module": 1,
        "datatype": "river",
        "name": "river",
        "icon": null,
        "checked": 0,
        "level": 2,
        "pid": 409,
        "ordernum": 5,
        "configure": null,
        "sourcetype": 0,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": {
            "name": "图例",
            "items": [
                {
                    "style": "image:images/layer/998/431-0.png",
                    "label": "所有站点",
                    "value": "0"
                },
                {
                    "style": "image:images/layer/998/431-3.png",
                    "label": "接近警戒",
                    "value": "2"
                },
                {
                    "style": "image:images/layer/998/431-2.png",
                    "label": "超警戒水位",
                    "value": "2"
                },
                {
                    "style": "image:images/layer/998/431-1.png",
                    "label": "超保证水位",
                    "value": "1"
                }
            ],
            "index": 0,
            "styletype": null,
            "legendtype": null,
            "img": null
        },
        "export": 0,
        "motype": 15,
        "model": "4",
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": "river_interval",
        "label": "江河水情",
        "anytimeable": "river_anytime",
        "dailyable": 1,
        "hourable": null,
        "lines": 0,
        "typeid": 409,
        "typenum": 1,
        "typename": "水情信息"
    },
    {
        "id": 539,
        "module": 1,
        "datatype": "floodwarn_self",
        "name": "listen_id_539",
        "icon": null,
        "checked": 0,
        "level": 2,
        "pid": 409,
        "ordernum": 7,
        "configure": null,
        "sourcetype": 0,
        "playable": 1,
        "formable": 0,
        "fileable": 0,
        "legend": {
            "name": "图例",
            "items": [
                {
                    "style": "image:images/layer/998/431-0.png",
                    "label": "所有站点",
                    "value": "0"
                },
                {
                    "style": "image:images/layer/998/431-3.png",
                    "label": "接近警戒",
                    "value": "2"
                },
                {
                    "style": "image:images/layer/998/431-2.png",
                    "label": "超警戒水位",
                    "value": "2"
                },
                {
                    "style": "image:images/layer/998/431-1.png",
                    "label": "超保证水位",
                    "value": "1"
                }
            ],
            "index": 0,
            "styletype": null,
            "legendtype": null,
            "img": null
        },
        "export": 0,
        "motype": 15,
        "model": "4",
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": null,
        "label": "洪水预报",
        "anytimeable": null,
        "dailyable": 1,
        "hourable": null,
        "lines": 0,
        "typeid": 409,
        "typenum": 2,
        "typename": "水情信息"
    },
    {
        "id": 360,
        "module": 1,
        "datatype": "module_id_360",
        "name": "listen_id_360",
        "icon": null,
        "checked": 0,
        "level": 2,
        "pid": 409,
        "ordernum": 9,
        "configure": null,
        "sourcetype": 1,
        "playable": 0,
        "formable": 0,
        "fileable": 0,
        "legend": {
            "name": "水位变幅",
            "items": [
                {
                    "style": "color:#3333FF",
                    "label": "小于-5m",
                    "value": "0"
                },
                {
                    "style": "color:#3353FF",
                    "label": "-5~-4m",
                    "value": "1"
                },
                {
                    "style": "color:#3381FF",
                    "label": "-4~-3m",
                    "value": "2"
                },
                {
                    "style": "color:#33C3FF",
                    "label": "-3~-2m",
                    "value": "3"
                },
                {
                    "style": "color:#29CCCC",
                    "label": "-2~-1m",
                    "value": "4"
                },
                {
                    "style": "color:#81FFC8",
                    "label": "-1~0m",
                    "value": "5"
                },
                {
                    "style": "color:#ADFE7F",
                    "label": "无变化",
                    "value": "6"
                },
                {
                    "style": "color:#E2FF66",
                    "label": "0~1m",
                    "value": "7"
                },
                {
                    "style": "color:#FFFF33",
                    "label": "1~2m",
                    "value": "8"
                },
                {
                    "style": "color:#FFD433",
                    "label": "2~3m",
                    "value": "9"
                },
                {
                    "style": "color:#FFA733",
                    "label": "3~4m",
                    "value": "10"
                },
                {
                    "style": "color:#FE7933",
                    "label": "4~5m",
                    "value": "11"
                },
                {
                    "style": "color:#FF3333",
                    "label": "大于5m",
                    "value": "12"
                }
            ],
            "index": 0,
            "styletype": null,
            "legendtype": null,
            "img": null
        },
        "export": 0,
        "motype": 15,
        "model": "4",
        "params": null,
        "checkselect": "1",
        "subs": [],
        "sttypes": null,
        "rangeid": "",
        "label": "水位变幅",
        "anytimeable": "",
        "dailyable": 1,
        "hourable": null,
        "lines": 0,
        "typeid": 409,
        "typenum": 5,
        "typename": "水情信息"
    }
]

export {
    players,
    rsvrPlayer
}
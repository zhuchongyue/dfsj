const play =  {
        "index": 0,
        "availableNodeCount": [
            0,
            5
        ],
        "nodes": [
            {
                "type": "interval",
                "range": [
                    "2024-06-07 08:00:00",
                    "2024-06-07 08:00:00"
                ],
                "interval": 24,
                "symbol": "hours",
                "transform": [
                    {
                        "split": 8,
                        "field": "viewparams",
                        "pattern": "dataTime:{time#yyyy-MM-dd 08:00:00 @today<<08:00:00@seconds};lowvalue:{filter.legend};adcd:{user.adcd};offset:0;"
                    }
                ],
                "format": {
                    "short": "今日",
                    "title": "{user.adnm}日累计面降水实况分布图",
                    "long": "{time#M月d日8时@today<<08:00}~{time#M月d日8时@>@today::HH:mm|M月d日H时}"
                },
                "period": "history",
                "layer": {
                    "id": 184,
                    "type": "wms",
                    "url": "https://58.42.237.172:8188/meteo-wms/wmts",
                    "opacity": 0.4,
                    "extent": [
                        5201280.115334835,
                        829796.3992439833,
                        1.8222963243575696E7,
                        8390853.574368943
                    ],
                    "projection": "EPSG:3857",
                    "layers": null,
                    "layer": "yjgl_tif:GZ_STATION_ALL_DAY",
                    "datatype": "GZ_STATION_ALL",
                    "custom": null,
                    "matrixSet": null,
                    "matrixPrefix": null,
                    "matrixIds": null,
                    "resolution": null,
                    "resolutions": null,
                    "location": null,
                    "imgflag": 1,
                    "subdomains": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9
                    ]
                },
                "nodes": [],
                "extend": [
                    {
                        "source": "GZ_STATION_ALL",
                        "kind": null,
                        "type": null
                    }
                ]
            },
            {
                "type": "interval",
                "range": [
                    "2024-06-07 09:00:00",
                    "2024-06-07 09:00:00"
                ],
                "interval": 2,
                "symbol": "hours",
                "transform": [
                    {
                        "field": "viewparams",
                        "offset": 86400000,
                        "pattern": "lowvalue:{filter.legend};adcd:{user.adcd};startTime:1717714800;endTime:1717718400"
                    }
                ],
                "format": {
                    "short": "近1小时",
                    "title": "{user.adnm}近1小时面降水实况分布图",
                    "long": "{time#M月d日H时@<}~{time#M月d日H时}"
                },
                "period": "history",
                "layer": {
                    "id": 185,
                    "type": "wms",
                    "url": "https://58.42.237.172:8188/meteo-wms/wmts",
                    "opacity": 0.4,
                    "extent": [
                        5201280.115334835,
                        829796.3992439833,
                        1.8222963243575696E7,
                        8390853.574368943
                    ],
                    "projection": "EPSG:3857",
                    "layers": null,
                    "layer": "yjgl_tif:GZ_STATION_ALL_000_000",
                    "datatype": null,
                    "custom": null,
                    "matrixSet": null,
                    "matrixPrefix": null,
                    "matrixIds": null,
                    "resolution": null,
                    "resolutions": null,
                    "location": null,
                    "imgflag": 1,
                    "subdomains": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9
                    ]
                },
                "nodes": [],
                "extend": [
                    {
                        "source": "GZ_STATION_ALL",
                        "kind": null,
                        "type": null
                    }
                ]
            },
            {
                "type": "interval",
                "range": [
                    "2024-06-07 09:00:00",
                    "2024-06-07 09:00:00"
                ],
                "interval": 4,
                "symbol": "hours",
                "transform": [
                    {
                        "field": "viewparams",
                        "offset": 86400000,
                        "pattern": "lowvalue:{filter.legend};adcd:{user.adcd};startTime:1717707600;endTime:1717718400"
                    }
                ],
                "format": {
                    "short": "近3小时",
                    "title": "{user.adnm}近3小时面降水实况分布图",
                    "long": "{time#M月d日H时@<}~{time#M月d日H时}"
                },
                "period": "history",
                "layer": {
                    "id": 187,
                    "type": "wms",
                    "url": "https://58.42.237.172:8188/meteo-wms/wmts",
                    "opacity": 0.4,
                    "extent": [
                        5201280.115334835,
                        829796.3992439833,
                        1.8222963243575696E7,
                        8390853.574368943
                    ],
                    "projection": "EPSG:3857",
                    "layers": null,
                    "layer": "yjgl_tif:GZ_STATION_ALL_000_000",
                    "datatype": null,
                    "custom": null,
                    "matrixSet": null,
                    "matrixPrefix": null,
                    "matrixIds": null,
                    "resolution": null,
                    "resolutions": null,
                    "location": null,
                    "imgflag": 1,
                    "subdomains": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9
                    ]
                },
                "nodes": [],
                "extend": [
                    {
                        "source": "GZ_STATION_ALL",
                        "kind": null,
                        "type": null
                    }
                ]
            },
            {
                "type": "interval",
                "range": [
                    "2024-06-07 09:00:00",
                    "2024-06-07 09:00:00"
                ],
                "interval": 7,
                "symbol": "hours",
                "transform": [
                    {
                        "field": "viewparams",
                        "offset": 86400000,
                        "pattern": "lowvalue:{filter.legend};adcd:{user.adcd};startTime:1717696800;endTime:1717718400"
                    }
                ],
                "format": {
                    "short": "近6小时",
                    "title": "{user.adnm}近6小时面降水实况分布图",
                    "long": "{time#M月d日H时@<}~{time#M月d日H时}"
                },
                "period": "history",
                "layer": {
                    "id": 188,
                    "type": "wms",
                    "url": "https://58.42.237.172:8188/meteo-wms/wmts",
                    "opacity": 0.4,
                    "extent": [
                        5201280.115334835,
                        829796.3992439833,
                        1.8222963243575696E7,
                        8390853.574368943
                    ],
                    "projection": "EPSG:3857",
                    "layers": null,
                    "layer": "yjgl_tif:GZ_STATION_ALL_000_000",
                    "datatype": null,
                    "custom": null,
                    "matrixSet": null,
                    "matrixPrefix": null,
                    "matrixIds": null,
                    "resolution": null,
                    "resolutions": null,
                    "location": null,
                    "imgflag": 1,
                    "subdomains": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9
                    ]
                },
                "nodes": [],
                "extend": [
                    {
                        "source": "GZ_STATION_ALL",
                        "kind": null,
                        "type": null
                    }
                ]
            },
            {
                "type": "interval",
                "range": [
                    "2024-06-07 09:00:00",
                    "2024-06-07 09:00:00"
                ],
                "interval": 13,
                "symbol": "hours",
                "transform": [
                    {
                        "field": "viewparams",
                        "offset": 86400000,
                        "pattern": "lowvalue:{filter.legend};adcd:{user.adcd};startTime:1717675200;endTime:1717718400"
                    }
                ],
                "format": {
                    "short": "近12小时",
                    "title": "{user.adnm}近12小时面降水实况分布图",
                    "long": "{time#M月d日H时@<}~{time#M月d日H时}"
                },
                "period": "history",
                "layer": {
                    "id": 186,
                    "type": "wms",
                    "url": "https://58.42.237.172:8188/meteo-wms/wmts",
                    "opacity": 0.4,
                    "extent": [
                        5201280.115334835,
                        829796.3992439833,
                        1.8222963243575696E7,
                        8390853.574368943
                    ],
                    "projection": "EPSG:3857",
                    "layers": null,
                    "layer": "yjgl_tif:GZ_STATION_ALL_000_000",
                    "datatype": null,
                    "custom": null,
                    "matrixSet": null,
                    "matrixPrefix": null,
                    "matrixIds": null,
                    "resolution": null,
                    "resolutions": null,
                    "location": null,
                    "imgflag": 1,
                    "subdomains": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9
                    ]
                },
                "nodes": [],
                "extend": [
                    {
                        "source": "GZ_STATION_ALL",
                        "kind": null,
                        "type": null
                    }
                ]
            },
            {
                "type": "interval",
                "range": [
                    "2024-06-07 09:00:00",
                    "2024-06-07 09:00:00"
                ],
                "interval": 25,
                "symbol": "hours",
                "transform": [
                    {
                        "field": "viewparams",
                        "offset": 86400000,
                        "pattern": "lowvalue:{filter.legend};adcd:{user.adcd};startTime:1717632000;endTime:1717718400"
                    }
                ],
                "format": {
                    "short": "近24小时",
                    "title": "{user.adnm}近24小时面降水实况分布图",
                    "long": "{time#M月d日H时@<}~{time#M月d日H时}"
                },
                "period": "history",
                "layer": {
                    "id": 183,
                    "type": "wms",
                    "url": "https://58.42.237.172:8188/meteo-wms/wmts",
                    "opacity": 0.4,
                    "extent": [
                        5201280.115334835,
                        829796.3992439833,
                        1.8222963243575696E7,
                        8390853.574368943
                    ],
                    "projection": "EPSG:3857",
                    "layers": null,
                    "layer": "yjgl_tif:GZ_STATION_ALL_000_000",
                    "datatype": null,
                    "custom": null,
                    "matrixSet": null,
                    "matrixPrefix": null,
                    "matrixIds": null,
                    "resolution": null,
                    "resolutions": null,
                    "location": null,
                    "imgflag": 1,
                    "subdomains": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9
                    ]
                },
                "nodes": [],
                "extend": [
                    {
                        "source": "GZ_STATION_ALL",
                        "kind": null,
                        "type": null
                    }
                ]
            }
        ],
        "extensible": ""
    }


const dbz =   {
        "index": 0,
        "availableNodeCount": [
            0,
            5
        ],
        "nodes": [
            {
                "type": "interval",
                "range": [
                    "2024-06-07 15:00:00",
                    "2024-06-07 15:00:00"
                ],
                "interval": 5,
                "symbol": "minutes",
                "transform": [
                    {
                        "field": "viewparams",
                        "offset": -28800000,
                        "pattern": "pubs:{time#yyyy-MM-dd HH:mm:00@seconds};dataTime:{time#yyyy-MM-dd HH:mm:00@seconds};lowvalue:{filter.legend};adcd:{user.adcd};offset:8"
                    }
                ],
                "format": {
                    "short": "{time#HH时m分}",
                    "title": "{user.adnm}雷达回波实况分布图",
                    "long": "{time#yyyy年MM月dd日 HH时mm分}"
                },
                "period": "history",
                "layer": {
                    "id": 9,
                    "type": "wms",
                    "url": "http://dfsjwms1.dfsjcloud.com/wms",
                    "opacity": 0.4,
                    "extent": [
                        5201280.115334835,
                        829796.3992439833,
                        1.8222963243575696E7,
                        8390853.574368943
                    ],
                    "projection": "EPSG:3857",
                    "layers": null,
                    "layer": "yjgl_tif:RADA_DBZ",
                    "datatype": "dbz",
                    "custom": null,
                    "matrixSet": null,
                    "matrixPrefix": null,
                    "matrixIds": null,
                    "resolution": null,
                    "resolutions": null,
                    "location": null,
                    "imgflag": null,
                    "subdomains": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9
                    ]
                },
                "nodes": [],
                "extend": [
                    {
                        "source": "contour.s_radar_shp",
                        "kind": null,
                        "type": null
                    }
                ]
            },
            {
                "type": "interval",
                "range": [
                    "2024-06-07 15:05:00",
                    "2024-06-07 17:00:00"
                ],
                "interval": 5,
                "symbol": "minutes",
                "transform": [
                    {
                        "field": "viewparams",
                        "offset": -28800000,
                        "pattern": "pubs:{time#yyyy-MM-dd HH:mm:00@seconds};dataTime:{time#yyyy-MM-dd HH:mm:00@seconds};lowvalue:{filter.legend};adcd:{user.adcd};offset:8"
                    }
                ],
                "format": {
                    "short": "{time#HH时m分}",
                    "title": "{user.adnm}雷达回波推衍分布图",
                    "long": "{time#yyyy年MM月dd日 HH时mm分}"
                },
                "period": "forecast",
                "layer": {
                    "id": 10,
                    "type": "wms",
                    "url": "http://dfsjwms1.dfsjcloud.com/wms",
                    "opacity": 0.4,
                    "extent": [
                        5201280.115334835,
                        829796.3992439833,
                        1.8222963243575696E7,
                        8390853.574368943
                    ],
                    "projection": "EPSG:3857",
                    "layers": null,
                    "layer": "yjgl_tif:RADA_DBZ",
                    "datatype": "dbz",
                    "custom": null,
                    "matrixSet": null,
                    "matrixPrefix": null,
                    "matrixIds": null,
                    "resolution": null,
                    "resolutions": null,
                    "location": null,
                    "imgflag": null,
                    "subdomains": [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8,
                        9
                    ]
                },
                "nodes": [],
                "extend": [
                    {
                        "source": "contour.s_radar_shp",
                        "kind": null,
                        "type": null
                    }
                ]
            }
        ],
        "extensible": "L6"
    }


export {play,dbz}
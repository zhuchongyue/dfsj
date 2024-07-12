// @formatter:off
/**
 * 全局常量定义。
 */
const Define: any = {};
Define.Unit = {
  SEGMENT_POLYGON: 'SEGMENT_POLYGON',
  CALC_POLYGON: 'CALC_POLYGON',
  CALC_POLYGON_UPPER: 'CALC_POLYGON_UPPER', // 上游断面配置
};
Define.riverColor = {
  // 1: '#f09614',
  // 2: '#fae600',
  2: {
    value: '超保证水位',
    color: '#eac60f',
  },
  1: {
    value: '超警戒水位',
    color: '#fa6400',
  },
  3: {
    value: '接近警戒水位',
    color: '#306ae8',
  },
}
/**
 * 定义资源类别代码
 */
Define.Resource = {
  RESERVOIR: 1, // 水库水文站点
  RIVER_FRAGMENT: 2, // 河段
  FLOOD_CONTROL_TOWN: 3, // 防洪城镇
  RAINFALL_STATION: 4, // 雨量站
  WEATHER_STATION: 5, // 气象站
  RESERVOIR_RAINFALL_STATION: 6, // 水库雨量站
  HYDROLOGY_STAGE_STATION: 7, // 水位站
  DROUGHT_SEVERITY_STATION: 8, // 旱情站
  VIDEO_STATION: 9, // 视频站
  WATER_MONITOR_STATION: 11, // 水质站
  SMALL_BASIN: 13, // 小流域
  TORRENTIAL_FLOOD_SECTION: 14, // 山洪断面
  HYDROLOGY_STATION: 15, // 水文站 //重点河道
  PONDING_POINT: 16, // 积水点
  WATERFLOOD_POINT: 17, // 洪水点
  SLUICE_STATION: 20, // 闸位站
  RIVER: 151, // 河流信息树
  SENSITIVE_POINT: 40, // 敏感点
  WEATHER_POINT: 99, // 天气预报
  WEATHER_POINT_PLAY: 427, // 天气预报
  SOILMOISTURE_STATION: 30, // 墒情站
  FLOOD_STATION: 111, // 洪水风险点
  NATION_WARNING: 'warning', // 国家发布的预警
  AGRICULTURAL_DISASTER: 135, // 农业灾害监测点
  AGRICULTURAL_SOIL_MOISTURE: 144, // 农业土壤墒情站
  WATER_CONSERVANCY_VIDEO: 145, // 水利视频
  RAINFALL_STATION_TWO: 42, // 山洪站点-山洪水位点
  RAINFALL_STATION_THREE: 43, // 山洪站点-山洪水位雨量站
  RAINFALL_STATION_FOUR: 169, // 雨量站-预警上图
  RESERVOIR_ALARM_STATION: 434, // 水库listen_id_434
  HYDROLOGY_ALARM_STATION: 412, //  河道listen_id_412
  PPTN_RAINFALL_STATION: 331, //  listen_id_331
  FISHING_VESSEL: 3312, // 渔船
  REPORT_DANGER: 3313, // 上报风险
  FORECAST_SECTION: 1201, // 预报断面
  FORECAST_SECTION_RESULT: 'forecastReuslt', //断面预报
};

/**
 * 定义预警级别对应的颜色
 * @type {{"1": string, "2": string, "3": string, "4": string}}
 */
Define.IndexColor = {
  1: '#dc2828',
  2: '#f09614',
  3: '#fae600',
  4: '#3764ff',
  5: '#ffffff',
};

/**
 * 随机颜色
 * @type {string[]}
 */
Define.RandomColor = [
  '#2fc25b',
  '#3aa1ff',
  '#13c2c2',
  '#d64700',
  '#8543e0',
  '#ff5879',
  '#047878',
  '#570026',
  '#8db500',
  '#00293e',
  '#f1baf3',
  '#ff006d',
  '#d50afa',
  '#3ea0e8',
  '#e506ee',
  '#9c1c5c',
];

Define.EMPTY_ARRAY = Object.seal([]);
Define.WarningMap = {
  LEVEL: { red: 1, orange: 2, yellow: 3, blue: 4, unknown: 5 },
  NAMED: {
    red: '红色',
    orange: '橙色',
    yellow: '黄色',
    blue: '蓝色',
    unknown: '未知',
  },
};
Define.RsvrColor = {
  2: '#f09614',
  3: '#fae600',
  4: '#3764ff',
  5: '#dc2828',
};
Define.RsvrLevel = {
  1: '大一',
  2: '大二',
  3: '中型',
  4: '小一',
  5: '小二',
  6: '其他',
};
Define.EngGradOptions = [
  {
    value: '1',
    label: 'Ⅰ',
  },
  {
    value: '2',
    label: 'Ⅱ',
  },
  {
    value: '3',
    label: 'Ⅲ',
  },
  {
    value: '4',
    label: 'Ⅳ',
  },
  {
    value: '5',
    label: 'Ⅴ',
  },
];

Define.CategoryOptions = [
  { value: '1', label: '纯公益性' },
  { value: '2', label: '准公益性' },
  { value: '3', label: '经营性' },
  { value: '9', label: '暂未划分' },
];

Define.EngScalMapOptions = [
  {
    label: '大(一)型',
    value: '1',
  },
  {
    label: '大(二)型',
    value: '2',
  },
  {
    label: '中型',
    value: '3',
  },
  {
    label: '小(一)型',
    value: '4',
  },
  {
    label: '小(二)型',
    value: '5',
  },
  {
    label: '其他',
    value: '6',
  },
];
//水库类型
Define.RsvrtypeOptions = [
  {
    value: '1',
    dicCode: 'RSKD',
    label: '山区水库',
  },
  {
    value: '2',
    dicCode: 'RSKD',
    label: '丘陵区水库',
  },
  {
    value: '3',
    dicCode: 'RSKD',
    label: '平原区水库',
  },
  {
    value: '4',
    dicCode: 'RSKD',
    label: '滨海区水库',
  },
];

Define.IndustryOptions = [
  { value: 1, letter: 'A', label: '水利部门' },
  { value: 2, letter: 'B', label: '能源部门' },
  { value: 3, letter: 'C', label: '交通部门' },
  { value: 4, letter: 'D', label: '住建部门' },
  { value: 5, letter: 'E', label: '农业部门' },
  { value: 6, letter: 'F', label: '林业部门' },
  { value: 7, letter: 'G', label: '旅游部门' },
  { value: 8, letter: 'H', label: '司法部门' },
  { value: 10, letter: 'J', label: '国资委' },
  { value: 9, letter: 'Z', label: '其他' },
];

Define.EngStatTypeOptions = [
  {
    label: '未建',
    value: '0',
  },
  {
    label: '在建',
    value: '1',
  },
  {
    label: '已建',
    value: '2',
  },
  {
    label: '未验收',
    value: '5',
  },
  {
    label: '竣工验收',
    value: '3',
  },
  {
    label: '未蓄水',
    value: '4',
  },
  {
    label: '蓄水验收',
    value: '6',
  },
  {
    label: '已蓄水',
    value: '7',
  },
  // { value: '1', dicCode: 'CNBSINST', label: '竣工验收' },
  // { value: '0', dicCode: 'CNBSINST', label: '下闸蓄水' },
];

// 测站基础信息表类型
Define.StationType = {
  MM: '气象站',
  BB: '蒸发站',
  DD: '堰闸水文站',
  TT: '潮位站',
  DP: '泵站',
  SS: '墒情站',
  PP: '雨量站',
  ZQ: '河道水文站',
  ZZ: '河道水位站',
  RR: '水库水文站',
  ZG: '地下水站',
  ZB: '分洪水位站',
};

Define.StationTypeOptions = [
  {
    label: '气象站',
    value: 'MM',
  },
  {
    label: '蒸发站',
    value: 'BB',
  },
  {
    label: '堰闸水文站',
    value: 'DD',
  },
  {
    label: '潮位站',
    value: 'TT',
  },
  {
    label: '泵站',
    value: 'DP',
  },
  {
    label: '墒情站',
    value: 'SS',
  },
  {
    label: '雨量站',
    value: 'PP',
  },
  {
    label: '河道水文站',
    value: 'ZQ',
  },
  {
    label: '河道水位站',
    value: 'ZZ',
  },
  {
    label: '水库水文站',
    value: 'RR',
  },
  {
    label: '地下水站',
    value: 'ZG',
  },
  {
    label: '分洪水位站',
    value: 'ZB',
  },
];

Define.MwrtbdtpTypeOptions = [
  {
    label: '挡水坝',
    value: '1',
  },
  {
    label: '挡水闸',
    value: '2',
  },
  {
    label: '滚水坝',
    value: '3',
  },
];

// 挡水主坝类型按材料分
Define.DamTypeMatType = {
  1: '混凝土坝',
  2: '碾压混凝土坝',
  3: '浆砌石坝',
  4: '土坝',
  5: '堆石坝',
  9: '其它',
};
Define.DamTypeMatTypeOptions = [
  {
    label: '混凝土坝',
    value: '1',
  },
  {
    label: '碾压混凝土坝',
    value: '2',
  },
  {
    label: '浆砌石坝',
    value: '3',
  },
  {
    label: '土坝',
    value: '4',
  },
  {
    label: '堆石坝',
    value: '5',
  },
  {
    label: '其它',
    value: '9',
  },
];

// 挡水主坝类型按结构分
Define.DamTypeStrType = {
  1: '重力坝',
  2: '拱坝',
  3: '支墩坝',
  4: '均质坝',
  5: '心墙坝',
  6: '斜墙坝',
  7: '面板坝',
  9: '其它',
};
Define.DamTypeStrTypeOptions = [
  {
    label: '重力坝',
    value: '1',
  },
  {
    label: '拱坝',
    value: '2',
  },
  {
    label: '支墩坝',
    value: '3',
  },
  {
    label: '均质坝',
    value: '4',
  },
  {
    label: '心墙坝',
    value: '5',
  },
  {
    label: '斜墙坝',
    value: '6',
  },
  {
    label: '面板坝',
    value: '7',
  },
  {
    label: '其它',
    value: '9',
  },
];

// 主要泄洪建筑物型式
Define.DscncltpType = {
  100: '溢洪道',
  101: '陡槽式溢洪道',
  102: '侧槽式溢洪道',
  103: '滑雪道式溢洪道',
  104: '井式溢洪道',
  105: '虹吸式溢洪道',
  199: '其它',
  201: '坝身中孔',
  202: '坝身底孔',
  300: '水工隧洞',
  301: '泄洪隧洞',
  302: '发电隧洞',
  303: '灌溉引水隧洞',
  304: '放空隧洞',
  399: '其它',
  401: '发电引水钢管',
  999: '其它',
};
Define.DscncltpTypeOptions = [
  {
    label: '溢洪道',
    value: 100,
  },
  {
    label: '陡槽式溢洪道',
    value: 101,
  },
  {
    label: '侧槽式溢洪道',
    value: 102,
  },
  {
    label: '滑雪道式溢洪道',
    value: 103,
  },
  {
    label: '井式溢洪道',
    value: 104,
  },
  {
    label: '虹吸式溢洪道',
    value: 105,
  },
  {
    label: '其它',
    value: 199,
  },
  {
    label: '坝身中孔',
    value: 201,
  },
  {
    label: '坝身底孔',
    value: 202,
  },
  {
    label: '水工隧洞',
    value: 300,
  },
  {
    label: '泄洪隧洞',
    value: 301,
  },
  {
    label: '发电隧洞',
    value: 302,
  },
  {
    label: '灌溉引水隧洞',
    value: 303,
  },
  {
    label: '放空隧洞',
    value: 304,
  },
  {
    label: '其它',
    value: 399,
  },
  {
    label: '发电引水钢管',
    value: 401,
  },
  {
    label: '其它',
    value: 999,
  },
];

// 水库类型
Define.RsvrtpType = {
  1: '小二',
  2: '小一',
  3: '中型',
  4: '大二',
  5: '大一',
  9: '其他',
};

// 报讯等级

// 报讯等级
Define.FrgrdType = {
  1: '中央报汛站',
  2: '省级重点报汛站',
  3: '省级一般报汛站',
  4: '其它报汛站',
  '-1': '全部',
};
Define.FrgrdTypeOptions = [
  {
    label: '中央报汛站',
    value: '1',
  },
  {
    label: '省级重点报汛站',
    value: '2',
  },
  {
    label: '省级一般报汛站',
    value: '3',
  },
  {
    label: '其它报汛站',
    value: '4',
  },
  {
    label: '全部',
    value: '-1',
  },
];
// 主要挡水建筑物
Define.MwrtbdtpType = {
  1: '挡水坝',
  2: '挡水闸',
};



// 主要泄洪建筑物型式
Define.DscncltpType = {
  100: '溢洪道',
  101: '陡槽式溢洪道',
  102: '侧槽式溢洪道',
  103: '滑雪道式溢洪道',
  104: '井式溢洪道',
  105: '虹吸式溢洪道',
  199: '其它',
  201: '坝身中孔',
  202: '坝身底孔',
  300: '水工隧洞',
  301: '泄洪隧洞',
  302: '发电隧洞',
  303: '灌溉引水隧洞',
  304: '放空隧洞',
  399: '其它',
  401: '发电引水钢管',
  999: '其它',
};

Define.EndstpOptions = [
  {
    value: '1',
    label: '底流',
  },
  {
    value: '2',
    label: '面流',
  },
  {
    value: '3',
    label: '挑流',
  },
  {
    value: '9',
    label: '挑流',
  },
];
Define.OpenCloseOptions = [
  {
    value: 1,
    label: '卷扬式启闭机',
  },
  {
    value: 2,
    label: '螺杆启闭机',
  },
  {
    value: 3,
    label: '液压启闭机',
  },
  {
    value: 4,
    label: '链式启闭机',
  },
  {
    value: 5,
    label: '门式启闭机',
  },
  {
    value: 6,
    label: '台车式启闭机',
  },
  {
    value: 7,
    label: '桥式启闭机',
  },
  {
    value: 9,
    label: '其他',
  },
];
Define.spillwayTypeOptions = [
  {
    value: 1,
    label: '正槽式溢洪道',
  },
  {
    value: 2,
    label: '侧槽式溢洪道',
  },
  {
    value: 0,
    label: '其他',
  },
];

Define.ingttpOptions = [
  {
    value: 1,
    label: '平板门',
  },
  {
    value: 2,
    label: '弧形门',
  },
  {
    value: 3,
    label: '叠梁门',
  },
  {
    value: 4,
    label: '人字门',
  },
  {
    value: 5,
    label: '自动翻板门',
  },
  {
    value: 9,
    label: '其他',
  },
];

Define.FstpType = {
  1: '主汛期',
  2: '后汛期',
  3: '过渡期',
  4: '其他',
};

// 防洪工程-水库类型
Define.ResType = {
  1: '山丘水库',
  2: '平原水库',
  3: '地下水库',
};

// 防洪工程-工程等别
Define.ResGrade = {
  1: 'Ⅰ',
  2: 'Ⅱ',
  3: 'Ⅲ',
  4: 'Ⅳ',
  5: 'Ⅴ',
};

// 水库运行状况
Define.RunState = {
  1: '在用良好',
  2: '在用故障',
  3: '停用',
};

// 工程建设情况
Define.EngState = {
  0: '未建',
  1: '在建',
  2: '已建',
};

Define.FloodLevel = {};

Define.Menu = {
  UNIQUE: 'datatype',
};

Define.WarningMap = {
  LEVEL: { red: 1, orange: 2, yellow: 3, blue: 4, unknown: 5 },
  NAMED: {
    red: '红色',
    orange: '橙色',
    yellow: '黄色',
    blue: '蓝色',
    unknown: '未知',
  },
};

Define.WarningColor = {
  RED_COLOR: '#f44336',
  ORANGE_COLOR: '#F2973D',
  YELLOW_COLOR: '#E0D016',
  BLUE_COLOR: '#027be3',
  DEFAULT_COLOR: '#00ABDF',
  RED_COLOR_RGB: 'rgb(244, 67, 54, 0.5)',
  ORANGE_COLOR_RGB: 'rgb(242, 151, 61, 0.5)',
  YELLOW_COLOR_RGB: 'rgb(224, 208, 22, 0.5)',
  BLUE_COLOR_RGB: 'rgb(2, 123, 227, 0.5)',
  DEFAULT_COLOR_RGB: 'rgb(0, 171, 223, 0.5)',
};


//水库任务
Define.TaskStrType = {
  1: '防洪',
  2: '灌溉',
  3: '供水',
  4: '发电',
  5: '航运',
  6: '放凌',
  7: '生态',
  8: '旅游',
  9: '养殖',
  99: '其他',
};
Define.TaskStrTypeOptions = [
  {
    value: 1,
    label: '防洪',
  },
  {
    value: 2,
    label: '灌溉',
  },
  {
    value: 3,
    label: '供水',
  },
  {
    value: 4,
    label: '发电',
  },
  {
    value: 5,
    label: '航运',
  },
  {
    value: 6,
    label: '放凌',
  },
  {
    value: 7,
    label: '生态',
  },
  {
    value: 8,
    label: '旅游',
  },
  {
    value: 9,
    label: '养殖',
  },
  {
    value: 99,
    label: '其他',
  },
];

export default Define;

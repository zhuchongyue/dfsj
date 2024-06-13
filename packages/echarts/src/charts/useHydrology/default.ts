import assign from "../../utils/assign";
import config, {CATEGORY, axis, options} from "../../config";
import {to} from "../../utils/tools";
export default assign({}, options, {
	// 用以指标的标签错开分布的属性提供，设置为空数组即可
	$indices: [],
	// 用以图表统计的统计频率（毫秒）
	$statistical: 100,
	// 设置图表是否可以动态追加数据
	$appendable: 3,
	$series: [
		{
			$code: CATEGORY.STAGE,
			z: 5,
			type: "line",
			smooth: true,
			large: true,
			emphasis: {itemStyle: {opacity: 0.8}},
			itemStyle: {opacity: 0},
			markPoint: {
				data: [{
					type: "max",
					symbolSize: 8,
					symbol:'',
					label: {
						position: 'top',
						align:'center',
						verticalAlign: 'bottom',
						// offset: [0, -7],
						color: "inherit",
						fontWeight: "bold",
						fontSize: 14,
						formatter: e => to(e.value),
					},
				}],
			},
		},
		{
			$code: ~CATEGORY.STAGE,
			z: 5,
			type: "line",
			smooth: true,
			large: true,
			emphasis: {itemStyle: {opacity: 0.8}},
			itemStyle: {opacity: 0},
			markPoint: {
				data: [{
					type: "max",
					symbolSize: 8,
					symbol:'',
					label: {
						// offset: [0, -7],
						position: 'top',
						align:'center',
						verticalAlign: 'bottom',
						color: "inherit",
						fontWeight: "bold",
						fontSize: 14,
						formatter: e => to(e.value),
					},
				}],
			},
		},
	],
	//以上为自定义配置，以下为eChart官方配置
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	color: config.color,
	grid: {
		top: 60,
		bottom: 60,
		left: 80,
		right: 80,
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'cross',
		},
	},
	legend: {
		show: true,
		top: 10,
	},
	dataZoom: [
		{
			type: 'slider',
			brushSelect: false,
			handleIcon: config.icon.zoom,
			handleSize: "60%",
			realtime: true,
			throttle: 30,
			bottom: 10,
			height: 20,
		}, {
			type: 'inside',
		},
	],
	xAxis: [{
		...axis,
		//name: "时间",
		type: "category",
		boundaryGap: false,
		axisLine: {onZero: false},
		nameGap: 30,
	}],
	yAxis: [
		{
			...axis,
			$layout: CATEGORY.STAGE,
			type: "value",
			// name: "水位（m）",
			nameLocation: 'middle',
			nameGap: 50,
			nameTextStyle: {
				align: "right",
			},
			min: v => to(v.min - (v.max - v.min) * 0.1),
			max: v => to(v.max + (v.max - v.min) * 0.1),
		},
		{
			...axis,
			$layout: ~CATEGORY.STAGE,
			type: "value",
			nameLocation: 'middle',
			nameGap: 50,
			nameTextStyle: {
				align: "left",
			},
		},
	],
});

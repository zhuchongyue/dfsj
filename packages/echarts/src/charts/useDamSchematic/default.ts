import cfg, {axis, options} from '../../config'
import {to} from '../../utils/tools'
import i0 from './images/0.png'
import i1 from './images/1.png'
import i2 from './images/2.png'
import i3 from './images/3.png'
import i4 from './images/4.png'
import i5 from './images/5.png'
import i6 from './images/6.png'
import i7 from './images/7.png'
import i8 from './images/8.png'
import i9 from './images/9.png'
import assign from '../../utils/assign'

export const IMAGES = [i0, i1, i2, i3, i4, i5, i6, i7, i8, i9]

/**
 * 定义每种大坝类型的配置信息
 * @type {Object}
 */
export const TYPES = {
	[-1]: {
		// -1表示未知大坝类型
		/**
		 * 大坝示意图的垂直像素分割信息：[坝底高度,坝身高度,坝顶距图片顶部的高度，图片宽度，图片高度].
		 * 定义此信息后，高程点才能准确的算出在屏幕上的坐标。
		 */
		section: [30, 1000, 50, 1080, 1920],
		/**
		 * 获取水位y的右上角及右下角对应的x。
		 * 注意数组里面是函数，参数为y，返回x坐标。
		 */
		water: [(y) => 1080, (y) => 1080],
		/**
		 * 根据水位y计算对应的x。用于分布标记点的起始位置x。
		 * @param y {Number} 水位
		 * @returns {number} x轴的位置
		 */
		point: (y) => (Math.round(y) < 30 ? 1020 : (700700 + 310 * y) / 1000),
		/**
		 * 标记点的绘制位置
		 */
		mark: [1000, 900]
	},
	0: {
		section: [30, 1000, 50, 1080, 1920],
		water: [(y) => 1200, (y) => 1200],
		point: (y) => (Math.round(y) < 30 ? 1110 : (185060 + 898 * y) / 1000),
		mark: [1100, 900]
	},
	1: {
		section: [30, 1000, 50, 1080, 1920],
		water: [(y) => 1200, (y) => 1200],
		point: (y) => (Math.round(y) < 30 ? 1180 : (253000 + 900 * y) / 1000),
		mark: [1200, 900]
	},
	2: {
		section: [34, 1000, 50, 1080, 1920],
		water: [(y) => 1200, (y) => 1200],
		point: (y) => (Math.round(y) < 30 ? 1070 : (40000 + 1000 * y) / 1000),
		mark: [1100, 900]
	},
	3: {
		section: [34, 962, 88, 1080, 1920],
		water: [(y) => 1223, (y) => 956],
		point: (y) => (Math.round(y) < 30 ? 1440 : y < 316 ? 940 : (555168 + 257 * y) / 677),
		mark: [1250, 800]
	},
	4: {
		section: [34, 962, 88, 1080, 1920],
		water: [(y) => 1223, (y) => 956],
		point: (y) => (Math.round(y) < 30 ? 1440 : y < 316 ? 940 : (555168 + 257 * y) / 677),
		mark: [1250, 800]
	},
	5: {
		section: [34, 1000, 50, 1080, 1920],
		water: [(y) => 1200, (y) => 1200],
		point: (y) => (Math.round(y) < 30 ? 1070 : (40000 + 1000 * y) / 1000),
		mark: [1100, 900]
	},
	6: {
		section: [34, 1000, 50, 1080, 1920],
		water: [(y) => 1200, (y) => 1200],
		point: (y) => (Math.round(y) < 30 ? 1070 : (40000 + 1000 * y) / 1000),
		mark: [1100, 900]
	},
	7: {
		section: [34, 1000, 50, 1080, 1920],
		water: [(y) => 1200, (y) => 1200],
		point: (y) => (Math.round(y) < 30 ? 1070 : (40000 + 1000 * y) / 1000),
		mark: [1100, 900]
	},
	8: {
		section: [43, 945, 92, 1080, 1920],
		water: [(y) => 1000, (y) => 1000],
		point: (y) => (Math.round(y) < 43 ? 1670 : y > 340 ? 960 : (253500 + 93 * y) / 297),
		mark: [1130, 800]
	},
	9: {
		section: [48, 945, 90, 1080, 1920],
		water: [(y) => 1000, (y) => 1000],
		point: (y) => (Math.round(y) < 43 ? 1670 : y > 340 ? 960 : (253500 + 93 * y) / 297),
		mark: [1130, 800]
	}
}

export default assign({}, options, {
	// 当前库容标记配置
	$capacity: {
		symbol: 'circle',
		symbolSize: 1,
		label: {
			fontSize: 18,
			offset: [110, 0],
			color: '#fff',
			textShadowBlur: 5,
			textShadowColor: cfg.markColor[1]
		}
	},
	// 当前水位标记配置
	$stage: {
		symbol: `path://${cfg.icon.stage}`,
		symbolSize: 160,
		symbolOffset: [100, -3],
		label: {
			fontSize: 15,
			offset: [33, -5]
		}
	},
	// 当前水位、库容公共配置
	$current: {
		z: 3,
		silent: true,
		type: 'scatter',
		symbolKeepAspect: true,
		hoverAnimation: true,
		showEffectOn: 'render',
		rippleEffect: { brushType: 'stroke' },
		label: { show: true, color: 'inherit', fontSize: 16, fontWeight: 'bold' },
		itemStyle: {
			color: cfg.markColor[1],
			shadowBlur: 5,
			shadowColor: 'rgba(51,51,51,0.56)',
			shadowOffsetX: 1,
			shadowOffsetY: 1
		}
	},
	// 水配置
	$water: {
		z: 0,
		type: 'water',
		symbolSize: 0,
		xAxisIndex: 0,
		tooltip: false,
		count: 3,
		itemStyle: {
			color: {
				type: 'linear',
				x: 0,
				y: 0,
				x2: 0,
				y2: 1,
				colorStops: [
					{
						offset: 0.0,
						color: 'skyblue' // 0% 处的颜色
					},
					{
						offset: 0.7,
						color: 'deepskyblue' // 100% 处的颜色
					}
				],
				global: false // 缺省为 false
			}
		}
	},
	// 时间标记区域配置
	$area: {
		// 历史标记区域, 图标为实心圆点
		history: {
			title: '历史',
			symbol: 'circle'
		},
		// 预报标记区域, 图标为空心圆点
		forecast: {
			title: '预报',
			symbol: 'emptyCircle'
		}
	},
	//以上为自定义配置，以下为eChart官方配置
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	title: {
		x: 'center',
		text: '大坝示意图',
		top: 10,
		textStyle: {
			fontSize: 15
		}
	},
	color: cfg.color,
	legend: false,
	tooltip: { formatter: (e) => `${e.value[6]}：${e.value[1]}（m）` },
	grid: {
		top: 60,
		bottom: 30,
		left: 80,
		right: 80
	},
	timeline: {
		axisType: 'category',
		autoPlay: false,
		playInterval: 1000,
		bottom: 0,
		left: 80,
		right: 80,
		data: null,
		z: 3,
		label: {
			color: '#fff'
		},
		progress: {
			label: {
				color: '#4ff8c4'
			}
		}
	},
	xAxis: {
		type: 'value',
		min: 0,
		max: 1920,
		axisTick: false,
		axisLabel: false,
		splitLine: false,
		axisLine: false
	},
	yAxis: {
		...axis,
		name: '高程(m)',
		type: 'value',
		splitLine: false,
		axisLabel: { formatter: (v) => to(v) },
		nameTextStyle: {
			align: 'right'
		}
	},
	graphic: {
		type: 'image',
		id: 'background',
		bounding: 'raw',
		left: 80,
		bottom: 30,
		z: 1,
		position: [0, 0],
		style: {}
	},
	series: []
})

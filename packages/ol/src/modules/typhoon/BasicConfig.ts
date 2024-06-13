import {TyphoonData, TyphoonLocation, TyphoonOptions} from './types'
import {imgCenter, imgLand} from '../../themes'
import dayjs from 'dayjs'

const DATE_FORMAT = `YYYY年MM月DD HH时mm分ss秒`
const DATE_FORMAT_SIMPLE = `M月d日H时`
const policeLine = {
	projection: 'EPSG:4326',
	lines: [
		{
			font: 'bold 14px arial',
			color: 'blue',
			width: 1,
			style: 'dotted',
			title: '48小时警戒线',
			outlineColor: '#fff',
			outlineWidth: 0,
			coordinates: [
				[132, 34],
				[132, 15],
				[120, 0],
				[105, 0]
			],
			label: [132, 34],
			labelOffset: [10, 10]
		},
		{
			font: 'bold 14px arial',
			color: 'yellow',
			width: 1,
			style: 'solid',
			title: '24小时警戒线',
			outlineColor: '#fff',
			outlineWidth: 0,
			coordinates: [
				[127, 34],
				[127, 22],
				[120, 18],
				[120, 11],
				[113, 4.5],
				[105, 0]
			],
			label: [127, 34],
			labelOffset: [10, 10]
		}
	]
}
const typhoonOptions = <TyphoonOptions>{
	delay: 10,
	projection: 'EPSG:4326',
	forecastColors: {
		中国: '#ff3145',
		中国香港: '#febd00',
		中国台湾: '#ff00fe',
		美国: '#04faf7',
		日本: '#5acd3f'
	},
	powerColors: {
		6: '#02ff02',
		7: '#02ff02',
		8: '#0263fd',
		9: '#0263fd',
		11: '#fffb05',
		10: '#fffb05',
		12: '#ffac05',
		13: '#ffac05',
		14: '#f171f9',
		15: '#f171f9',
		16: '#fe0202',
		17: '#fe0202',
		18: '#fe0202',
		19: '#fe0202',
		20: '#7f0d0d',
		21: '#7f0d0d',
		22: '#530909',
		23: '#530909'
	},
	path: {
		outlineColor: (v) => typhoonOptions.forecastColors?.[v?.data?.organization] ?? '#00BFFF',
		outlineWidth: (v) => (v?.data?.organization ? 1 : 2),
		outlineDash: (v) => (v?.data?.organization ? [5, 5, 5] : undefined),
		color: (v) => typhoonOptions.forecastColors?.[v?.data?.organization] ?? '#00BFFF'
	},
	center: {
		zIndex: 5,
		// image: {
		type: 'icon',
		image: imgCenter,
		scale: 1,
		// },
		label: {
			text: (v) => `${v.data.chinese}（${v.node.time}）`,
			font: 'bold 13px arial',
			textAlign: 'left',
			color: '#333',
			offset: [0, 20],
			outlineColor: '#666',
			outlineWidth: 0.1
		}
	},
	start: {
		color: (v) => {
			return typhoonOptions.powerColors[v.node?.power] ?? 'white'
		},
		outlineColor: '#666',
		outlineWidth: 0,
		size: 5,
		image: {
			type: 'circle'
		},
		label: {
			font: 'bold 13px arial',
			textAlign: 'left',
			offset: [0, 10],
			text: (v) => `${v.data.chinese}（${v.data.code}）`
		}
	},
	radius7: {
		// #0ebec4
		zIndex: 1,
		outlineColor: 'rgba(14, 190 ,196,0.9)',
		outlineWidth: 1,
		color: 'rgba(14, 190 ,196,0.3)',
		overlay: {
			title: '七级风圈',
			content: (v) => {
				return `<fieldset class="typhoon">
                  <li><i>西北:${v.radius7?.nw}km</i><i>东北:${v.radius7?.ne}km</i></li>
                  <li><i>西南:${v.radius7?.sw}km</i><i>东南:${v.radius7?.se}km</i></li>
                </fieldset>`
			}
		}
	},
	radius10: {
		zIndex: 0,
		outlineColor: 'rgba(253 ,174, 13,0.9)',
		outlineWidth: 1,
		color: 'rgba(253 ,174 ,13,0.3)',
		overlay: {
			title: '十级风圈',
			content: (v) => {
				return `<fieldset class="typhoon">
                   <li><i>西北:${v.radius10?.nw}km</i><i>东北:${v.radius10?.ne}km</i></li>
                  <li><i>西南:${v.radius10?.sw}km</i><i>东南:${v.radius10?.se}km</i></li>
                </fieldset>`
			}
		}
	},
	radius12: {
		zIndex: 0,
		outlineColor: 'rgba(251 ,59 ,0,0.9)',
		outlineWidth: 1,
		color: 'rgba(251, 59 ,0,0.3)',
		overlay: {
			title: '十二级风圈',
			content: (v) => {
				return `<fieldset class="typhoon">
                   <li><i>西北:${v.radius12?.nw}km</i><i>东北:${v.radius12?.ne}km</i></li>
                  <li><i>西南:${v.radius12?.sw}km</i><i>东南:${v.radius12?.se}km</i></li>
                </fieldset>`
			}
		}
	},

	point: {
		size: (v) => {
			return Math.max(Math.round(v?.node?.power / 2.5), 4)
		},
		outlineColor: 'rgba(51,51,51,0.77)',
		outlineWidth: 1,
		color: (v) => typhoonOptions.powerColors[v?.node?.power] || 'white',
		image: {
			type: 'circle'
		}
	},
	land: {
		image: imgLand,
		scale: 0.6,
		label: {
			font: 'bold 18px arial',
			align: 'left',
			color: 'red',
			offset: [10, -20],
			text: ({ data }) => {
				return `${data.time}`
			}
		},
		overlay: {
			title: ({ data }) => `台风【${data.cname}】登录信息`,
			content: ({ node }) => {
				return `<fieldset class="typhoon">
                  <li><i>登陆时间：</i><i>${dayjs(node.time).format(DATE_FORMAT)}</i></li>
                  <li><i>登陆坐标：</i><i>${node.coordinates[0]}°/${node.coordinates[1]}°</i></li>
                  <li><i>登陆地址：</i><i>${node.address}</i></li>
                  <li><i>台风强度：</i><i>${node.strong}</i></li>
                  <li><i>描述信息：</i><i>${node.message}</i></li>
                </fieldset>`
			}
		}
	},
	effect: {
		color: 'rgba(225,171,79,0.3)',
		outlineColor: 'rgba(140,92,12,0.9)',
		outlineWidth: 1
	}
}

function toRadiusString(radius) {
	let min = Math.min(...radius)
	let max = Math.max(...radius)
	if (isNaN(min) || isNaN(max)) return '--'
	if (min === 0 || min === max) return max + '公里'
	return `${min}~${max}公里`
}

function wrap(value, open = '（', close = '）') {
	return value != null ? open + value + close : ''
}

const pointOverlay = {
	title: (v) => {
		const data: TyphoonData = v.data,
			node: TyphoonLocation = v.node
		const forecast = v.forecast ? `【${v.forecast.organization}】` : ''
		const time = dayjs(node.time).format(DATE_FORMAT_SIMPLE)
		return `<b>${data.chinese}</b><span style="font-size: 12px"> ${time}${forecast}</span>`
	},
	content: (v) => {
		const node: TyphoonLocation = v.node
		const wind =
			`${node.wind}米/秒` +
			(node.power ? ` <b style="color:red">${node.power}级${wrap(node.strong)}</b>` : '')
		const content = [
			`<li><i>中心位置</i><i>：${node.coordinates[0]}°/${node.coordinates[1]}°</i></li>`,
			node.wind && `<li><i>风速风力</i><i>：${wind}</i></li>`,
			node.pressure && `<li><i>中心气压</i><i>：${node.pressure}百帕</i></li>`,
			node.move && `<li><i>移速移向</i><i>：${node.move}公里/小时 ${node.trend || ''}</i></li>`,
			node.radius7?.length && `<li><i>七级半径</i><i>：${toRadiusString(node.radius7)}</i></li>`,
			node.radius10?.length && `<li><i>十级半径</i><i>：${toRadiusString(node.radius10)}</i></li>`,
			node.radius12?.length && `<li><i>十二级半径</i><i>：${toRadiusString(node.radius12)}</i></li>`
		]
			.filter((e) => e)
			.join('')
		return `<fieldset class="typhoon">${content}</fieldset>`
	}
}

export { policeLine, typhoonOptions, pointOverlay }

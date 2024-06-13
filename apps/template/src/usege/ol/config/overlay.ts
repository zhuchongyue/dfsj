const units = [
	{ value: 1e4, symbol: '亿m³' },
	{ value: 1e2, symbol: '百万m³' },
	{ value: 0, symbol: '万m³' }
]
const warningType = {
	Red: '红色',
	Orange: '橙色',
	Yellow: '黄色',
	Blue: '蓝色'
}
const OverlayCfg = {
	1: {
		title: (data: any) => data.monm,
		loader: () => {},
		content: (data: any) => {
			let unit = units.find((e) => data.w >= e.value) || units[2]
			return `<fieldset style="border: none">
                <li><i>站点编码：</i><i>${data.stcd}</i></li>
                <li><i>库水位：</i><i>${data.rz == null ? '--' : data.rz}(m)</i></li>
                <li><i>时间：</i><i>${data.tm || '--'}</i></li>
                <li><i>地址：</i><i>${data.address || '--'}</i></li>
              </fieldset>`
		}
	},
	2: {
		title: (data) => data.headline,
		content: (data) => {
			return `<ul class="default">
                <li><i>发布时间：</i><i>${data.sendTime || '--'}</i></li>
                <li><i>预警类型：</i><i>${data.eventName || '--'}</i></li>
                <li><i>预警级别：</i><i>${
									(data.severity && warningType[data.severity]) || '未知'
								}</i></li>
                <li><i>来源：</i><i>${data.sender || '--'}</i></li>
                <li><i>描述：</i><i>${data.description || '--'}</i></li>
              </ul>`
		}
	}
}
export default OverlayCfg

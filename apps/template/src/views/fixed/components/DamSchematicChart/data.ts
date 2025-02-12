 const Data = {
	code: 0,
	msg: '操作成功',
	data: {
		type: 0,
		source: [
			['2023-01-30 11:00:00', 86.65, 243.0],
			['2023-01-30 12:00:00', 86.65, 243.0],
			['2023-01-30 13:00:00', 86.695, 244.0],
			['2023-01-30 14:00:00', 86.665, 243.0],
			['2023-01-30 15:00:00', 86.608, 242.0],
			['2023-01-30 16:00:00', 86.544, 240.0],
			['2023-01-30 17:00:00', 86.469, 239.0],
			['2023-01-30 18:00:00', 86.481, 239.0],
			['2023-02-01 12:00:00', 82.271, 209.0],
			['2023-02-01 16:00:00', 84.608, 215.0]
		],
		points: [
			{
				altitude: 32.0,
				name: '坝底高程',
				type: 'bottom'
			},
			{
				symbol: 'altitude',
				altitude: 82.0,
				name: '死水位'
			},
			{
				altitude: 84.0,
				name: '汛限水位'
			},
			{
				altitude: 84.0,
				name: '正常蓄水位'
			},
			{
				altitude: 93.15,
				level: 4,
				name: '设计水位'
			},
			{
				altitude: 97.9,
				level: 1,
				name: '校核水位'
			},
			{
				altitude: 101.6,
				name: '坝顶高程',
				type: 'top'
			}
		],
		imageSection: null,
		area: [
			{
				time: ['2023-01-30 11:00:00', '2023-02-01 16:00:00'],
				type: 'history'
			}
		]
	}
}

 export default  Data;
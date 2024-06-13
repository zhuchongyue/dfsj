export const billboardConfig = {
	style: {
		normal: {
			image: {
				type: 'icon',
				image: {
					imageSrc: '/images/layers/1/0.png',
					scale: 0.3
				}
			},
			text: {
				text: null
			}
		},
		hovered: {
			text: {
				textAlign: 'center',
				textBaseline: 'middle',
				textFont: 'bold 18px 微软雅黑',
				text: (v: any) => v?.stnm?.trim?.() || v?.stcd,
				textFill: {
					fillColor: '#00FFFF'
				},
				textOffsetY: 30
			}
		}
	},
	overlay: {
		title: (data: any = {}) => `${data.stnm}`,
		content: (data: any = {}) => {
			return `<fieldset class="typhoon">
                  <li><i>站点编码：</i><i>${data?.stcd}</i></li>
                  <li><i>站点名称：</i><i>${data?.stnm}</i></li>
                  <li><i>最新数据时间：</i><i>${data?.updatetime}</i></li>
                  <li><i>地址：</i><i>${data?.strong}</i></li>
                  <li><i>备注：</i><i>${data?.message}</i></li>
                  <li><i>站点状态：</i><i>${data?.onlineStatus}</i></li>
                </fieldset>`
		}
	}
}

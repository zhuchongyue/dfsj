export interface IDownOptions {
	name: string
	suffix: string
	pixelRatio: number
	backgroundColor: string
}

const defOptions: IDownOptions = {
	name: '图表图片',
	suffix: '.png',
	pixelRatio: 2,
	backgroundColor: '#fff'
}

export function useDownLoad(getFn: any) {
	const downloadImg = (options?: IDownOptions) => {
		const def = Object.assign({}, defOptions, options)
		const chartIns = typeof getFn == 'function' ? getFn() : getFn
		let imgUrl = chartIns?.getDataURL({
			pixelRatio: def.pixelRatio,
			backgroundColor: def.backgroundColor
		})
		let tempA = document.createElement('a')
		tempA.download = def.name + def.suffix
		tempA.href = imgUrl
		document.body.appendChild(tempA)
		tempA.click()
		tempA.remove()
	}

	return {
		downloadImg
	}
}

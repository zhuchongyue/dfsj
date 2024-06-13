import {read, utils, writeFile} from 'xlsx'

function exportFile(options) {
	return new Promise((resolve, reject) => {
		try {
			let book = null
			switch (options.type) {
				case 'json': {
					book = utils.book_new()
					let sheet = utils.json_to_sheet(options.data, options.config)
					utils.book_append_sheet(book, sheet, 'Sheet1')
					break
				}
				case 'excel2json': {
					// excel输出为json格式字符串
					const reader = new FileReader()
					reader.onload = function (e) {
						const data = e.target.result
						const wb = read(data, { type: 'binary' })
						const result = []
						wb.SheetNames.forEach((sheetName) => {
							result.push({
								sheetName: sheetName,
								sheet: utils.sheet_to_json(wb.Sheets[sheetName], { defval: '' })
							})
						})
						return resolve(result)
					}
					return reader.readAsBinaryString(options.file) // input方法
				}
				default: {
					let titleArr = []
					if (options.columns) {
						options.columns.map((item) => {
							titleArr.push(item.label)
						})
					} else {
						options.data.columns.map((item) => {
							titleArr.push(item.label)
						})
					}
					exportExcel(
						options.source || options.data.source,
						options.file,
						titleArr,
						options.sheetName,
						options.columns || options.data.columns
					)
					return
				}
			}
			writeFile(book, options.file)
			resolve(false)
		} catch (exception) {
			console.error(exception)
			reject(exception)
		}
	})
}

export function exportExcel(json, name, titleArr, sheetName, options) {
	/* convert state to workbook */
	let data = new Array()
	let keyArray = new Array()
	const getLength = function (obj) {
		let count = 0
		for (let i in obj) {
			if (obj.hasOwnProperty(i)) {
				count++
			}
		}
		return count
	}
	for (const key1 in json) {
		if (json.hasOwnProperty(key1)) {
			const element = json[key1]
			let rowDataArray = new Array()
			options.map((item) => {
				if (element.hasOwnProperty(item.field)) {
					const element2 = element[item.field]
					rowDataArray.push(element2)
					if (keyArray.length < getLength(element)) {
						keyArray.push(item.field)
					}
				}
			})

			data.push(rowDataArray)
		}
	}
	data.splice(0, 0, keyArray, titleArr)
	const ws = utils.aoa_to_sheet(data)
	const wb = utils.book_new()
	// 此处隐藏英文字段表头
	let wsrows = [{ hidden: true }]
	ws['!rows'] = wsrows // ws - worksheet
	utils.book_append_sheet(wb, ws, sheetName)
	/* generate file and send to client */
	writeFile(wb, name + '.xlsx')
}

export default exportFile

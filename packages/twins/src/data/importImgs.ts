const importPanoramas: any = []
// @ts-ignore
const files = import.meta.globEager('/public/sphere/*.jpg') as any
console.log('importPanoramas', files)
Object.keys(files).forEach((fileName, index) => {
	let fName = fileName.replace(/(.*\/)*([^.]+).*/gi, '$2')
	let fType = fileName.replace(/.+\./, '')
	importPanoramas[index] = {
		name: fName,
		fullPath: fileName,
		src: files[fileName].default,
		suffix: fType
	}
})
export default importPanoramas

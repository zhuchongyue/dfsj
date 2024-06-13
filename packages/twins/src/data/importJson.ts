/***
 * 获取文件名 作为key(这个和全景图id、名称保持一致的)
 * @param fullPath
 */
const getFileName = (fullPath: string) => {
	if (!fullPath) return null
	const regex = /\/(.*?)\./ // 匹配斜杠后面的内容，直到最近的一个点
	const result = fullPath.match(regex)[1] // 获取匹配到的第一个子组
	return result ?? null
}
/**
 * 判断文件名是否含有中文
 * @param filename
 */
const hasChinese = (filename: string) => {
	const regex = /[\u4e00-\u9fa5]/ // 中文字符的 Unicode 范围是 \u4e00-\u9fa5
	const has = regex.test(filename)
	let d = undefined
	return has
}

// @ts-ignore
const files = import.meta.globEager('./*.ts') as any
console.log('linkPanoramas', files)
const linkPanoramas = Object.keys(files)
	.map((filePath) => {
		const filename = getFileName(filePath)
		if (hasChinese(filename)) {
			const fileContent = files[filePath]?.default // 获取文件内容
			if (!Array.isArray(fileContent)) return null
			return {
				[filename]: fileContent
			}
		} else {
			return null
		}
	})
	.filter((item) => item !== null)
	.reduce((acc, curr) => {
		acc = { ...acc, ...curr }
		return acc
	}, {})
export default linkPanoramas

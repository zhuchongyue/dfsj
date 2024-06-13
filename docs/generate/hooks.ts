import fs from 'fs'
import path from 'path'
import colors from 'picocolors'
import { deleteDirectory, getRootPath } from '../../scripts/utils'

const sourceDir = getRootPath('../hooks/src')
const targetDir = getRootPath('zh/hooks')
deleteDirectory(targetDir)
copy()

function copy() {
	let count = 0
	fs.readdirSync(sourceDir).forEach((dir) => {
		const indexPath = path.join(sourceDir, dir, 'index.md')
		const exit = fs.existsSync(indexPath)
		if (exit) {
			count++
			console.log(colors.green(`${dir}.md`) + `正在进行复制...`)
			// Get the target path for the file
			const targetPath = path.join(targetDir, `${dir}.md`)
			// Copy the file to the target directory
			fs.copyFileSync(indexPath, targetPath)
		}
	})
	console.log(colors.cyan(`✨ [hooks md: ${count}]`) + ` - hooks的md生成完毕！`)
}

/**
 * 全局的单例模式
 * 暂时有：右键菜单
 * 全局唯一的tip
 */
import Tooltip from './type/Tooltip'
import Popup from './type/Popup'

export default function createWidgets() {
	return {
		popup: new Popup(),
		tooltip: new Tooltip(),
		contextMenu: null
	}
}

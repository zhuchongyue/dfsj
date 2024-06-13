import Data from './data.ts'
import {cloneDeep} from 'lodash-es'

let defData: any = Data.data

export function useFetch() {
	const load = () => {
		let data = cloneDeep(defData)
		if (data == null) return null
		return data
	}

	return {
		load
	}
}

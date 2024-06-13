/***
 * 定义小区的名称、初始视角、对应图片路径
 */

// import importPanoramas from "../data/importImgs";//全景图
import links from '../data/importJson'

export const SPHERE_BASE_URL = `https://rkgeo.dfsjcloud.com/guizhou_Natural/stbc/sphere/`
const parametersCamera = [
	{
		name: '径流小区1-3号',
		fullPath: SPHERE_BASE_URL + '径流小区1-3号.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 2.7579863082407843,
			pitch: -0.27688709615632145
		}
	},
	{
		name: '径流小区11-12号',
		fullPath: SPHERE_BASE_URL + '径流小区11-12号.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 3.2280031474219193,
			pitch: -0.8751644144722235
		}
	},
	{
		name: '径流小区13-14号',
		fullPath: SPHERE_BASE_URL + '径流小区13-14号.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 6.209106438684168,
			pitch: -0.4599010270514925
		}
	},
	{
		name: '径流小区15-17号',
		fullPath: SPHERE_BASE_URL + '径流小区15-17号.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 0.2252684631362757,
			pitch: -0.7077978998186114
		}
	},
	{
		name: '径流小区18号',
		fullPath: SPHERE_BASE_URL + '径流小区18号.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 6.155106527880031,
			pitch: -1.2360746838533594
		}
	},
	{
		name: '径流小区4-6号',
		fullPath: SPHERE_BASE_URL + '径流小区4-6号.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 4.261545394202371,
			pitch: -1.3068456797961208
		}
	},
	{
		name: '径流小区7-8号',
		fullPath: SPHERE_BASE_URL + '径流小区7-8号.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 6.219619201126413,
			pitch: -1.1503959101355563
		}
	},
	{
		name: '径流小区9-10号',
		fullPath: SPHERE_BASE_URL + '径流小区9-10号.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 3.1050934688641125,
			pitch: -1.0914861798433813
		}
	},
	{
		name: '监测站点-正门',
		fullPath: SPHERE_BASE_URL + '监测站点-正门.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 3.133637861660979,
			pitch: -0.4546889911065173
		}
	},
	{
		name: '监测站点-气象站',
		fullPath: SPHERE_BASE_URL + '监测站点-气象站.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 1.9907566572069677,
			pitch: -0.8065901052300726
		}
	},
	{
		name: '监测站点-西侧径流小区',
		fullPath: SPHERE_BASE_URL + '监测站点-西侧径流小区.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 6.262067702912386,
			pitch: -0.9167704182472658
		}
	},
	{
		name: '监测站点-鸟览',
		fullPath: SPHERE_BASE_URL + '监测站点-鸟览.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 0.8380025580901728,
			pitch: -0.47294721772761994
		}
	},
	{
		name: '羊鸡冲水库低空',
		fullPath: SPHERE_BASE_URL + '羊鸡冲水库低空.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 0.5750939722588093,
			pitch: -0.4017734844716281,
			fov: 1.3608936558192368
		}
	},
	{
		name: '羊鸡冲水库高空',
		fullPath: SPHERE_BASE_URL + '羊鸡冲水库高空.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 2.588120388762217,
			pitch: -0.3374817965959078
		}
	},
	{
		name: '锦绣园宾馆低空',
		fullPath: SPHERE_BASE_URL + '锦绣园宾馆低空.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 1.6715269438039215,
			pitch: -0.5009322335784794
		}
	},
	{
		name: '锦绣园宾馆高空',
		fullPath: SPHERE_BASE_URL + '锦绣园宾馆高空.jpg',
		suffix: 'jpg',
		initialViewParameters: {
			yaw: 1.6065644055310804,
			pitch: -0.5923659764986842
		}
	}
]
console.log('links', links)
const parametersConfig = parametersCamera.map((camera) => {
	const name = camera?.name
	// const findPathCfg = importPanoramas.find((e) => e?.name == name);
	const linkPanoramas = links[name]
	return {
		...camera,
		// ...findPathCfg,
		linkPanoramas
	}
})
const findParameter = (name: string) =>
	parametersConfig.find((e) => {
		return e?.name == name
	})
export { parametersCamera, parametersConfig, findParameter }

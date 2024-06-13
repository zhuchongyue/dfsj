import fs from "fs";
import path from "path";
import colors from "picocolors";
import {deleteDirectory, getRootPath, prefix} from "./utils";
const packagesToUpdate = ['ol', 'echarts','cesium','hooks','guest','utils']; // 替换为你需要更新的包的名称数组
const lernaPath = getRootPath('./'); // 替换为你的Lerna项目路径
function clearPackagesDist(): void {
    const packagesPath = path.join(lernaPath, 'packages');
    // 获取所有包的路径
    const packagePaths = fs.readdirSync(packagesPath)
        .map(packageName => path.join(packagesPath, packageName))
        .filter(packagePath => fs.lstatSync(packagePath).isDirectory());

    // 遍历每个包
    packagePaths.forEach(packagePath => {
        const dist = path.join(packagePath, 'dist');
        const packageJsonPath = path.join(packagePath, 'package.json');
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageJson: any = JSON.parse(packageJsonContent);
        if (packagesToUpdate.map((p) => prefix + p).includes(packageJson.name)){
            console.log('需要删除的',dist)
            deleteDirectory(dist,true)
        }
    });
}
clearPackagesDist()
import fs from 'fs';
import path from 'path';
import colors from "picocolors";
import {getRootPath, prefix} from "./utils";


export interface PackageJson {
    name: string;
    main: string;
    module: string;
    browser: string;
    types: string;
    files: string[];
}

enum Env {
    DEV = 'dev',
    PUB = 'pub'
}
const Url = {
    [Env.DEV]:'src/index.ts',
    [Env.PUB]:'dist/index.es.js'
}

function updatePackageJsonMain(lernaPath: string, packagesToUpdate: string[]): void {
    const packagesPath = path.join(lernaPath, 'packages');
    const env = process.argv[2];
    const entry = Url?.[env];
    console.log(colors.cyan(`✨ [当前环境: ${env}]  ${entry}`));
    // 获取所有包的路径
    const packagePaths = fs.readdirSync(packagesPath)
        .map(packageName => path.join(packagesPath, packageName))
        .filter(packagePath => fs.lstatSync(packagePath).isDirectory());

    // 遍历每个包
    packagePaths.forEach(packagePath => {
        const packageJsonPath = path.join(packagePath, 'package.json');
        try {
            // 读取package.json文件
            const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
            const packageJson: PackageJson = JSON.parse(packageJsonContent);
            // 如果该包需要更新，修改main字段为ESM语法
            if (packagesToUpdate.map((p) => prefix + p).includes(packageJson.name)) {
                if (!env) return;
                if (env == Env.DEV) {
                    packageJson.module = "src/index.ts";
                    packageJson.browser = "src/index.ts";
                    if (packageJson.name == '@dfsj/cesium'){
                        packageJson.module = "src/index.js";
                        packageJson.browser = "src/index.js";
                    }
                    packageJson.main = "dist/index.ts";
                    packageJson.types = "dist/index.d.ts";

                } else if (env == Env.PUB) {
                    packageJson.main = "dist/index.js";
                    packageJson.module = "dist/index.js";//后续定义为index.es.index
                    packageJson.browser = "dist/index.js";
                    packageJson.types = "dist/index.d.ts";
                }
                // 更新package.json文件
                fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
                console.log(`更新了 package.json for ${packageJson.name}`);
            }
        } catch (error) {
            console.error(`Error updating package.json for ${packagePath}:`, error);
        }
    });
}

// 使用示例
const lernaPath = getRootPath('./'); // 替换为你的Lerna项目路径
const packagesToUpdate = ['ol', 'echarts','cesium','hooks','components','guest','utils']; // 替换为你需要更新的包的名称数组

updatePackageJsonMain(lernaPath, packagesToUpdate);



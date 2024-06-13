/**
 * 用于打包时生成额外的配置文件。该文件可以配置一些全局变量，这样就可以直接在外部修改，而无需重新打包
 */
import {GLOB_CONFIG_FILE_NAME, OUTPUT_BASIC_DIR, OUTPUT_DIR} from '../constant';
import fs from 'fs-extra';
import fss from "fs"
import colors from 'picocolors';

import {getEnvConfig, getRootPath, loadEnvFiles} from '../utils';
import {getConfigFileName} from '../getConfigFileName';

import pkg from '../../package.json';

interface CreateConfigParams {
    configName: string;
    config: any;
    configFileName?: string;
    output: string;
}

function createConfig(params: CreateConfigParams) {
    const {configName, config, configFileName, output} = params;
    try {
        const windowConf = `window.${configName}`;
        // Ensure that the variable will not be modified
        let configStr = `${windowConf}=${JSON.stringify(config)};`;
        configStr += `
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '');

        fs.mkdirp(getRootPath(output));
        fss.writeFileSync(getRootPath(`${output}/${configFileName}`), configStr);

        console.log(colors.cyan(`✨ [${pkg.name}]`) + ` - configuration file is build successfully:`);
        console.log(colors.gray(output + '/' + colors.green(configFileName)) + '\n');
    } catch (error) {
        console.log(colors.red('configuration file configuration file failed to package:\n' + error));
    }
}

export function runBuildConfig() {
    const argvList = process.argv.splice(2);
    const config = getEnvConfig();
    const configFileName = getConfigFileName(config);
    createConfig({
        output: OUTPUT_DIR, config, configName: configFileName, configFileName: GLOB_CONFIG_FILE_NAME
    });
    if (!argvList.includes('modes')) {
        runMultiBuildConfig();
    }
}

/**
 * 生成多个环境的dist
 */
export function runMultiBuildConfig() {
    //获取所有的环境变量
    const regex = /\.env\.([^.]+)/;
    const envFiles = loadEnvFiles();
    if (envFiles.length > 0) {
        envFiles.forEach(async (envName) => {
            const match = envName?.match(regex);
            let fileName = match?.[1];
            const merge = ['.env', envName];
            const config = getEnvConfig('VITE_', merge);
            const configFileName = getConfigFileName(config);
            const sourceDir = getRootPath(OUTPUT_DIR);
            await fs.ensureDir(getRootPath(OUTPUT_BASIC_DIR + fileName));
            const destDir = getRootPath(OUTPUT_BASIC_DIR + fileName);
            await fs.emptyDir(destDir);
            if (fs.existsSync(getRootPath(OUTPUT_DIR))) {
                try {
                    fs.copySync(sourceDir, destDir);
                    createConfig({
                        output: destDir,
                        config,
                        configName: configFileName,
                        configFileName: GLOB_CONFIG_FILE_NAME,
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        });
    }
}

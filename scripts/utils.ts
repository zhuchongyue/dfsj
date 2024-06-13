import path from "path";
import fs from 'fs-extra';
import fss from 'fs';
import colors from "picocolors";

export const prefix = '@dfsj/';

export function getRootPath(...dir) {
    return path.resolve(process.cwd(), ...dir);
}

export async function deleteDirectory(directory, flag = false) {
    if (fs.existsSync(directory)) {
        // fs.readdirSync(directory).forEach((file) => {
        //     const currentPath = path.join(directory, file);
        //     if (fs.lstatSync(currentPath).isDirectory()) {
        //         deleteDirectory(currentPath); // Recursive call for subdirectories
        //     } else {
        //         fs.unlinkSync(currentPath); // Delete file
        //     }
        // });
        await fs.emptyDir(directory);
        // if (flag) fs.rmdirSync(directory); // Delete empty directory
        if (flag) fs.readdirSync(directory); // Delete empty directory
    }
    console.log(colors.green(`✨ [${directory}]-->>>目录下的所有文件和文件夹被删除`));
}

// Function to delete only the files within the target directory
function deleteFilesInDirectory(directory) {
    if (fs.existsSync(directory)) {
        fs.readdirSync(directory).forEach((file) => {
            const currentPath = path.join(directory, file);
            if (fs.lstatSync(currentPath).isFile()) {
                fs.unlinkSync(currentPath); // Delete file
            }
        });
    }
    console.log('Only files within the target directory are deleted!');
}
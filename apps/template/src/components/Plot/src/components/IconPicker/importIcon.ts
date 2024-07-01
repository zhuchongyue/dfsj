const  result: any = [];
const files = import.meta.glob('/src/assets/plot/*',{eager:true}) as any;
Object.keys(files).forEach((fileName,index) => {
    let fName = fileName.replace(/(.*\/)*([^.]+).*/ig,"$2")
    let fType = fileName.replace(/.+\./, "")
    result[index] = {
        name:fName,
        fullPath: fileName,
        src:files[fileName].default,
        suffix:fType,
    }
});
// console.log({result})
export default result;

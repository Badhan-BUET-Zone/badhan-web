import { saveAs } from 'file-saver';

export const processError = (error)=>{
    if(error.response && error.response.data && error.response.data.message){
        return error.response.data.message;
    }else{
        return "Unknown error occured";
    }
}

export const jsonToCSV = (json)=>{
    const array = [Object.keys(json[0])].concat(json)
    return array.map(it => {
        return Object.values(it).toString()
    }).join('\n')
}

export const textFileDownloadInWeb=(text, fileName)=>{
    let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    saveAs(blob, fileName);
}

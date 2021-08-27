import { saveAs } from 'file-saver';
import {bloodGroups} from "./constants";

export const processError = (error)=>{
    if(error.response && error.response.data && error.response.data.message){
        return error.response.data.message;
    }
    return "Unknown error occurred";
}

export const convertObjectToCSV = (objArray,keys,delimiter)=>{
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = keys.join(delimiter)+delimiter+'\r\n';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        keys.forEach((key)=>{
            line+= array[i][key]+delimiter;
        })
        str += line + '\r\n';
    }
    return str;
}

export const textFileDownloadInWeb=(text, fileName)=>{
    let blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    saveAs(blob, fileName);
}

export const processPersonsForReport = (persons)=>{
    persons.forEach((person)=>{
        person["Blood Group"] = bloodGroups[person.bloodGroup];
        person["Donation Count"] = person.donationCountOptimized;
        let date = new Date(person.lastDonation);
        person["Last Donation"] = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
    })
    return persons;
}

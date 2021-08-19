import {Capacitor, FilesystemDirectory, FilesystemEncoding, Plugins} from '@capacitor/core';
const { Device } = Plugins;
const { App } = Plugins;
const {Filesystem} = Plugins;

export const getDeviceInfo= async ()=>{
    return await Device.getInfo();
}

export const isNative = ()=>{
    return Capacitor.isNative;
}

export const exitApp = () =>{
    App.exitApp();
}

export const downloadTextFile = async (text,fileName)=>{
    return Filesystem.writeFile({
            path: '/'+fileName,
            data: text,
            directory: FilesystemDirectory.Documents,
            encoding: FilesystemEncoding.UTF8
        })
}


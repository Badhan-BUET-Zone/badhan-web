import {Capacitor,Plugins} from '@capacitor/core';
const { Device } = Plugins;
const { App } = Plugins;

export const getDeviceInfo= async ()=>{
    return await Device.getInfo();
}

export const isNative = ()=>{
    return Capacitor.isNative;
}

export const exitApp = () =>{
    App.exitApp();
}


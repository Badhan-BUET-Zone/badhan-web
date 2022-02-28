import { FilesystemDirectory, FilesystemEncoding, Plugins } from '@capacitor/core'

import gradleString from '../../android/app/build.gradle'
const { App } = Plugins
const { Filesystem } = Plugins

const g2js = require('gradle-to-js/lib/parser')

// custom android support
export const getLocalAppVersion = async () => {
  const representation = await g2js.parseText(gradleString)
  return representation.android.defaultConfig.versionName
}

// custom android support
export const getIsNative = () => {
  return window.origin.includes('localhost') && window.origin.split(':').length !== 3
}

// export const getDeviceInfo = async () => {
//   return await Device.getInfo()
// }
// export const getNativeAppVersion = async () => {
//   const info = await Device.getInfo()
//   return info.appVersion
// }

// export const isNative = () => {
//   return Capacitor.isNative
// }

export const exitApp = () => {
  App.exitApp()
}

export const downloadTextFile = async (text, fileName) => {
  return Filesystem.writeFile({
    path: '/' + fileName,
    data: text,
    directory: FilesystemDirectory.Documents,
    encoding: FilesystemEncoding.UTF8
  })
}

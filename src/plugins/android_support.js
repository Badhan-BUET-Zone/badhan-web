import { Plugins } from '@capacitor/core'

import gradleString from '../../android/app/build.gradle'
const { App } = Plugins

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

export const exitApp = () => {
  App.exitApp()
}

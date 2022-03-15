import gradleString from '../../android/app/build.gradle'

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

const getMethodNames = (obj) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function')

export const getAndroidInfo = async () => {
  const representation = await g2js.parseText(gradleString)
  return {
    windowOrigin: window.origin,
    versionInGradle: representation.android.defaultConfig.versionName,
    navigatorAppExitApp: navigator.app ? getMethodNames(navigator.app) : 'navigator.app undefined'
  }
}

// custom android support
export const exitApp = () => {
  navigator.app.exitApp()
}

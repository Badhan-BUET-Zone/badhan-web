/* eslint-disable */ 
// @ts-nocheck
/* eslint-disable */
import gradleString from '../../android/app/build.gradle'
import webviewGradleString from '../../webview/app/build.gradle'
import twaGradleString from '../../bubblewrap/app/build.gradle'

// custom android support
export const getCapacitorLocalAppVersion = () => {
  return gradleString.match(/\d+\.\d+\.\d+/)[0]
}
export const getWebViewLocalAppVersion = () => {
  return webviewGradleString.match(/\d+\.\d+\.\d+/)[0]
}

// custom android support
export const getIsCapacitorNative = () => {
  return window.origin.includes('localhost') && window.origin.split(':').length !== 3
}

export const getIsWebview = () => {
  return navigator.userAgent.includes("Droid Build")
}

const getMethodNames = (obj) => Object.getOwnPropertyNames(obj).filter(item => typeof obj[item] === 'function')

export const getAndroidInfo = async () => {
  // const representation = await g2js.parseText(gradleString)
  return {
    windowOrigin: window.origin,
    versionInCapacitorGradle: getCapacitorLocalAppVersion(),
    navigatorAppExitApp: navigator.app ? getMethodNames(navigator.app) : 'navigator.app undefined'
  }
}

// custom android support
export const exitApp = () => {
  navigator.app.exitApp()
}


// TWA support
let isAndroidTwaSession;
if (document.referrer.includes('android-app://com.mmmbadhan')) {
  isAndroidTwaSession = true;
  sessionStorage.setItem('has_android_twa_referrer', 'yes');
} else {
  isAndroidTwaSession = sessionStorage.getItem('has_android_twa_referrer') === 'yes';
}

export const getIsTWA = () => {
  return isAndroidTwaSession
}

export const getTWAAppVersion = () => {
  return twaGradleString.match(/\d+\.\d+\.\d+/)[0]
}
/* eslint-disable */ 
// @ts-nocheck
import { setWithExpiry, getWithExpiry } from './helpers'
const save = (frontendSettings) => {
  setWithExpiry('frontendSettings', frontendSettings, 60 * 1000)
}
const load = () => {
  return getWithExpiry('frontendSettings')
}
const clear = () => {
  localStorage.removeItem('frontendSettings')
}

export default {
  save, load, clear
}

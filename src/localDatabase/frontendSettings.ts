import { setWithExpiry, getWithExpiry } from '@/localDatabase/helpers'
const save = (frontendSettings: {version: string}) => {
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

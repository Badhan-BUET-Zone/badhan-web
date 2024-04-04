import { setWithExpiry, getWithExpiry, remove } from '@/localDatabase/helpers'
const save = (frontendSettings: {version: string}) => {
  setWithExpiry('frontendSettings', frontendSettings, 60 * 1000)
}
const load = () => {
  return getWithExpiry('frontendSettings')
}
const clear = () => {
  remove('frontendSettings')
}

export default {
  save, load, clear
}

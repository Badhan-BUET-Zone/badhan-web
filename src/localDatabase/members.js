import { setWithExpiry, getWithExpiry } from './helpers'
const save = (members) => {
  setWithExpiry('members', members, 60 * 1000)
}
const load = () => {
  return getWithExpiry('members')
}
const clear = () => {
  localStorage.removeItem('members')
}

export default {
  save, load, clear
}

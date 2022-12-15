// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { setWithExpiry, getWithExpiry } from './helpers'
const save = (members) => {
  setWithExpiry('publicContacts', members, 60 * 1000)
}
const load = () => {
  return getWithExpiry('publicContacts')
}
const clear = () => {
  localStorage.removeItem('publicContacts')
}

export default {
  save, load, clear
}

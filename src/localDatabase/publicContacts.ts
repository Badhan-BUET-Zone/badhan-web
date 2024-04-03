import { setWithExpiry, getWithExpiry, remove } from './helpers'
import {PublicContactInterface} from "@/store/publicContacts";
const save = (members: PublicContactInterface[]) => {
  setWithExpiry('publicContacts', members, 60 * 1000)
}
const load = () => {
  return getWithExpiry('publicContacts')
}
const clear = () => {
  remove('publicContacts')
}

export default {
  save, load, clear
}

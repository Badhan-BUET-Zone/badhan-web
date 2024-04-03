import { setWithExpiry, getWithExpiry, remove } from './helpers'
import {MemberAPIResponseInterface} from "@/store/members";
const save = (members: MemberAPIResponseInterface) => {
  setWithExpiry('members', members, 60 * 1000)
}
const load = () => {
  return getWithExpiry('members')
}
const clear = () => {
  remove('members')
}

export default {
  save, load, clear
}

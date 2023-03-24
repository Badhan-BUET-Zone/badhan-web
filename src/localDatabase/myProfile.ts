import { set, get } from '@/localDatabase/helpers'
import {MyProfileStateInterface} from "@/store/myprofile";

const storeKey = 'myProfile'
const save = (myProfile: MyProfileStateInterface) => {
    set(storeKey, myProfile)
}
const load = () => {
    return get(storeKey)
}
const clear = () => {
    localStorage.removeItem(storeKey)
}

export default {
    save, load, clear
}
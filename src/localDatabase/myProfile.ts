import { set, get, remove } from '@/localDatabase/helpers'
import {MyProfileStateInterface} from "@/store/myprofile";

const storeKey = 'myProfile'
const save = (myProfile: MyProfileStateInterface) => {
    set(storeKey, myProfile)
}
const load = () => {
    return get(storeKey)
}
const clear = () => {
    remove(storeKey)
}

export default {
    save, load, clear
}
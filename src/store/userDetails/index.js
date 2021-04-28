import comment from "@/store/userDetails/comment";
import userDetails from "@/store/userDetails/userDetails";
import promote from "@/store/userDetails/promote";
import donation from "@/store/userDetails/donation";
import password from "@/store/userDetails/password";
import deleteDonor from '@/store/userDetails/deleteDonor';

export default {
    actions:{
        resetAllMessages({commit,getters}){

        }
    },

    modules:{
        comment,
        userDetails,
        promote,
        donation,
        password,
        deleteDonor
    }
}
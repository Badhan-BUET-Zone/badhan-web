import comment from "@/store/userDetails/comment";
import userDetails from "@/store/userDetails/userDetails";
import donation from "@/store/userDetails/donation";
import callrecord from "@/store/userDetails/callrecord";

export default {
    actions:{
        resetAllMessages({commit,getters}){

        }
    },

    modules:{
        comment,
        userDetails,
        donation,
        callrecord
    }
}

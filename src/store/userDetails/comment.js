import {badhanAxios} from '@/api';
const state = {
    comment: null,
    commentLoaderFlag: false,
    commentSuccess: null,
    commentError: null,
};

const getters = {
    getComment(state){
        return state.comment
    },
    getCommentLoaderFlag(state){
        return state.commentLoaderFlag
    },
    getCommentSuccess(state){
        return state.commentSuccess;
    },
    getCommentError(state){
        return state.commentError;
    },
};
const mutations = {
    commentLoaderFlagOn(state){
        state.commentLoaderFlag = true;
    },
    commentLoaderFlagOff(state){
        state.commentLoaderFlag = false;
    },
    setCommentSuccess(state,payload){
        state.commentSuccess = payload;
    },
    clearCommentMessage(state){
        state.commentSuccess = null;
        state.commentError = null;
    },
    setCommentError(state,payload){
        state.commentError = payload;
    },

    setComment(state,payload){
        state.comment = payload;
    }

};
const actions = {
    async saveComment({commit,getters,rootState,rootGetters},payload){
        commit('clearCommentMessage');
        let sendData = {
            donorPhone: parseInt("88" + payload.phone),
            comment: payload.comment,
        };
        let headers = {
            "x-auth": rootGetters.getToken,
        };
        console.log("REQUEST TO /donor/comment: ", sendData);
        commit('commentLoaderFlagOn');
        try {
            let response = await badhanAxios.post("/donor/comment", sendData, {
                headers: headers,
            });
            console.log("RESPONSE FROM /donor/comment: ", response);

            commit('setCommentSuccess',"Successfully changed comment");

        } catch (error) {
            if(error.response && error.response.messsage){
                commit('setCommentError',message);
            }
            else{
                commit('setCommentError',error);
            }
            console.log(error.response);
        } finally {
            commit('commentLoaderFlagOff');
        }
    }
};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,

}
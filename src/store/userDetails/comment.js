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
    async saveComment({commit,getters,rootState,rootGetters, dispatch},payload){
        let sendData = payload;

        commit('commentLoaderFlagOn');
        try {
            let response = await badhanAxios.patch("/donors/comment", sendData);

            dispatch('notification/notifySuccess',"Successfully changed comment",{root: true})

        } catch (error) {

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

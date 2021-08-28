import {handlePATCHDonorsComment} from '../../api';

const state = {
    comment: null,
    commentLoaderFlag: false,
    commentSuccess: null,
    commentError: null,
};

const getters = {
    getComment(state) {
        return state.comment
    },
    getCommentLoaderFlag(state) {
        return state.commentLoaderFlag
    },
    getCommentSuccess(state) {
        return state.commentSuccess;
    },
    getCommentError(state) {
        return state.commentError;
    },
};
const mutations = {
    commentLoaderFlagOn(state) {
        state.commentLoaderFlag = true;
    },
    commentLoaderFlagOff(state) {
        state.commentLoaderFlag = false;
    },
    setCommentSuccess(state, payload) {
        state.commentSuccess = payload;
    },
    clearCommentMessage(state) {
        state.commentSuccess = null;
        state.commentError = null;
    },
    setCommentError(state, payload) {
        state.commentError = payload;
    },

    setComment(state, payload) {
        state.comment = payload;
    }

};
const actions = {
    async saveComment({commit, getters, rootState, rootGetters, dispatch}, payload) {
        commit('commentLoaderFlagOn');
        let response = await handlePATCHDonorsComment(payload);
        commit('commentLoaderFlagOff');
        if (response.status !== 200) return;
        dispatch('notification/notifySuccess', "Successfully changed comment", {root: true})
    }
};


export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,

}

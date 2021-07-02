import {badhanAxios} from '@/api';
const state = {
    deleteLoaderFlag: false,
    deleteMessage: null,
    isDeleteError: false,
};

const getters = {
    getDeleteLoaderFlag(state){
        return state.deleteLoaderFlag
    },
    getDeleteMessage(state){
        return state.deleteMessage;
    },
    getIsDeleteError(state){
        return state.isDeleteError;
    },
};
const mutations = {
    deleteLoaderFlagOn(state){
        state.deleteLoaderFlag = true;
    },
    deleteLoaderFlagOff(state){
        state.deleteLoaderFlag = false;
    },
    setDeleteMessage(state,payload){
        state.deleteMessage = payload;
    },
    clearDeleteMessage(state){
        state.deleteMessage = null;
        state.isDeleteError = false;
    },
    deleteErrorOn(state){
        state.isDeleteError = true;
    },

    deleteErrorOff(state,payload){
        state.isDeleteError = false;
    }

};
const actions = {
    async deleteDonor({commit,getters,rootState,rootGetters, dispatch},payload){
        commit('deleteLoaderFlagOn');
        try {
            let response = await badhanAxios.delete("/donors", {params:payload});
            dispatch('notification/notifySuccess',"Successfully deleted donor",{root: true});
            return true;
        } catch (error) {
            return false;
        } finally {
            commit('deleteLoaderFlagOff');
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

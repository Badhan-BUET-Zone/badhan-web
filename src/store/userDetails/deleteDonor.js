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
    async deleteDonor({commit,getters,rootState,rootGetters},payload){
        commit('clearDeleteMessage');

        commit('deleteLoaderFlagOn');
        try {
            let response = await badhanAxios.post("v2/admin/donor/delete", payload);

            commit('setDeleteMessage',"Successfully changed comment");
            commit('deleteErrorOff')

            return true;

        } catch (error) {
            if(error.response && error.response.messsage){
                commit('setDeleteMessage',error.response.messsage);
            }
            else{
                commit('setDeleteMessage',error);
            }
            commit('deleteErrorOn')
            console.log(error.response);
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
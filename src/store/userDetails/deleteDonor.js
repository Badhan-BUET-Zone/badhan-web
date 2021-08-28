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

};

export default {
    state,
    actions,
    getters,
    mutations,
    namespaced: true,

}

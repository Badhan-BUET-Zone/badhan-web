const state = {
    promoteFlag: false,
    promoteSuccess: null,
    promoteError: null
};

const getters = {
    getPromoteFlag: state=>{
        return state.promoteFlag;
    },
    getPromoteSuccess: state=>{
        return state.promoteSuccess;
    },
    getPromoteError: state=>{
        return state.promoteError;
    }
};
const mutations = {
    promoteFlagOn(state){
        state.promoteFlag=true;
    },
    promoteFlagOff(state){
        state.promoteFlag=false;
    },
    clearPromoteMessage(state){
        state.promoteSuccess=null;
        state.promoteError=null;
    },
    setPromoteError(state,payload){
        state.promoteError=payload;
    },
    setPromoteSuccess(state,payload){
        state.promoteSuccess=payload;
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

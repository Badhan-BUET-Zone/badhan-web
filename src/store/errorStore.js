const state = {
    errors:[],
};

const getters = {
    getErrors(state){
        return state.errors
    },
};
const mutations = {
    addError(state, err){
        state.errors.unshift({message: err.message,name: err.name,stack:err.stack, time: Date.now()});
    },
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

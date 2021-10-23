const state = {
    personModalFlag: false,
    personId:null,
};

const getters = {
    getPersonModalFlag(state){
        return state.personModalFlag;
    },
    getPersonId(state){
        return state.personId;
    }
};
const mutations = {
    setPersonModalFlag(state, payload){
        state.personModalFlag = payload;
    },
    setPersonId(state,id){
        state.personId = id
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

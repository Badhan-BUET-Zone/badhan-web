import {badhanAxios} from '@/api';
const state = {
    callRecords:[],
    callRecordsLoader:false,

    newCallRecordLoaderFlag: false,
    deleteCallRecordLoaderFlag: false,

};

const getters = {
    getCallRecords(state){
        return state.callRecords;
    },
    getCallRecordsLoader(state){
        return state.callRecordsLoader;
    },
    getNewCallRecordLoaderFlag(state){
        return state.newCallRecordLoaderFlag;
    },
    getDeleteCallRecordLoaderFlag(state){
        return state.deleteCallRecordLoaderFlag;
    },

};
const mutations = {
    callRecordsLoaderOn(state){
        state.callRecordsLoader = true;
    },
    callRecordsLoaderOff(state){
        state.callRecordsLoader = false;
    },
    setCallRecords(state,payload){
        state.callRecords = payload;
    },
    unsetCallRecords(state){
        state.callRecords = [];
    },
    setNewCallRecordLoaderFlag(state){
        state.newCallRecordLoaderFlag = true;
    },
    unsetNewCallRecordLoaderFlag(state){
        state.newCallRecordLoaderFlag = false;
    },
    setDeleteCallRecordLoaderFlag(state){
        state.deleteCallRecordLoaderFlag = true;
    },
    unsetDeleteCallRecordLoaderFlag(state){
        state.deleteCallRecordLoaderFlag = false;
    }
};
const actions = {
    async fetchCallRecords({commit,getters,rootState,rootGetters, dispatch},payload){
        commit('callRecordsLoaderOn');
        try {
            let response = await badhanAxios.get("/callrecords", {params:payload});
            commit('setCallRecords',response.data.callRecords,{root: true});
        } catch (error) {
        } finally {
            commit('callRecordsLoaderOff');
        }
    },
    async fetchCallRecordsForHome({commit},payload){
        try{
            let response = await badhanAxios.get("/callrecords", {params:payload});
            return response.data.callRecords;
        }catch(e){
            return null;
        }finally {
        }
    },
    async deleteCallRecord({commit,dispatch,getters},payload){
        commit('setDeleteCallRecordLoaderFlag');
        try{
            let response = await badhanAxios.delete("/callrecords",{params:payload});
            let callRecords = getters['getCallRecords'];
            callRecords = callRecords.filter((callRecord)=>{
                return callRecord._id !== payload.callRecordId
            });
            commit('setCallRecords',callRecords);
            dispatch('notification/notifySuccess',"Successfully deleted call record",{root: true})
        }catch(error){
        }finally{
            commit('unsetDeleteCallRecordLoaderFlag');
        }
    },
    async postCallRecord({commit,dispatch,getters,rootGetters},payload){
        commit('setNewCallRecordLoaderFlag');
        try{
            let response = await badhanAxios.post("/callrecords",payload);

            let callRecords = getters['getCallRecords'];
            let name = rootGetters['getName'];
            callRecords.unshift({...response.data.callRecord,callerId: {name,hall:rootGetters['getHall'],designation:rootGetters['getDesignation']}});
            commit('setCallRecords',callRecords);
            dispatch('notification/notifySuccess',"Added call record",{root: true})
        }catch(error){

        }finally {
            commit('unsetNewCallRecordLoaderFlag');
        }
    },
    async postCallRecordFromCard({commit,dispatch},payload){
        try{
            let response = await badhanAxios.post("/callrecords",payload);
            dispatch('notification/notifySuccess',"Added call record",{root: true})
        }catch(e){

        }finally{

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

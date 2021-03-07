import {badhanAxios} from "@/api";

const state={
    volunteers:[],
    volunteerError: null,
    volunteerLoader: false,

    newDonorLoader: false,
    newDonorError: null,
    newDonorSuccess: null,
};

const getters={
    getVolunteers: state=>{
        return state.volunteers;
    },
    getVolunteerError: state=>{
        return state.volunteerError;
    },
    getVolunteerLoader: state=>{
        return state.volunteerLoader;
    },

    getNewDonorLoader: state=>{
        return state.newDonorLoader;
    },
    getNewDonorError: state=>{
        return state.newDonorError;
    },
    getNewDonorSuccess: state=>{
        return state.newDonorSuccess;
    }


};
const mutations={
    setVolunteers(state,payload){
        state.volunteers = payload;
    },
    clearVolunteers(state){
        state.volunteers = [];

    },
    setVolunteerError(state,payload){
        state.volunteerError = payload;
    },
    clearVolunteerError(state){
        state.volunteerError = null;
    },
    volunteerLoaderOn(state){
        state.volunteerLoader = true;
    },
    volunteerLoaderOff(state){
        state.volunteerLoader = false;
    },


    newDonorLoaderOn(state){
        state.newDonorLoader=true;
    },
    newDonorLoaderOff(state){
        state.newD=false;
    },

    setNewDonorError(state,payload){
        state.newDonorError = payload;
    },
    setNewDonorSuccess(state,payload){
        state.newDonorSuccess = payload;
    },
    clearNewDonorMessage(state){
        state.newDonorError = null;
        state.newDonorSuccess = null;
    }


};
const actions={
    async fetchVolunteers({commit,getters}){
        commit('clearVolunteers');
        commit('clearVolunteerError');
        commit('volunteerLoaderOn');

        let headers = {
            'x-auth': getters.getToken
        };
        console.log("REQUEST TO /admin/volunteers: ","BLANK");
        try {
            let response = await badhanAxios.post('/admin/volunteers', {}, {headers});
            console.log("RESPONSE FROM /admin/volunteers: ",response);
            commit('setVolunteers',response.data.volunteerList);
        }catch (e){
            if(e.response && e.response.data.message){
                commit('setVolunteerError');
            }
        }finally {
            commit('volunteerLoaderOff');
        }

    },
    async saveDonor({commit, getters, },payload){
        commit('clearNewDonorMessage');
        commit('newDonorLoaderOn');

        let sendData = {
            userPhone: payload.userPhone,
            phone: payload.phone,
            bloodGroup: payload.bloodGroup,
            hall: payload.hall,
            name: payload.name,
            studentId: payload.studentId,
            address: payload.address,
            roomNumber: payload.roomNumber,
            comment: payload.comment,
            lastDonation: payload.lastDonation,
        };
        let headers = {
            "x-auth": getters.getToken,
        };
        console.log("REQUEST TO /donor/insert: ", sendData);

        try {
            let response = await badhanAxios.post("/donor/insert", sendData, {
                headers: headers,
            });
            console.log("RESPONSE FROM /donor/insert: ", response);

            commit('setNewDonorSuccess',"Donor added successfully");

            return true;
        } catch (error) {
            if(error.response && error.response.data){
                commit('setNewDonorError',error.response.data.message);
            }else{
                commit('setNewDonorError',error);
            }
            console.log(error.response);
            return false;
        } finally {
            commit('newDonorLoaderOff')
        }
    }
};


export default{
    state,
    actions,
    getters,
    mutations
}
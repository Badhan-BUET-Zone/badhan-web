import {badhanAxios} from "@/api";

const state={
    volunteers:[],
    volunteerError: null,
    volunteerLoader: false
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

    }
};


export default{
    state,
    actions,
    getters,
    mutations
}
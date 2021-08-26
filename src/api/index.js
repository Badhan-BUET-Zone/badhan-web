import axios from "axios";
import {store} from "@/store/store";
import {processError} from "../mixins/helpers";

const baseURL = process.env.VUE_APP_BADHAN_API_BASE_URL;

const badhanAxios = axios.create({
    baseURL
});

const enableGuestAPI = () => {
    badhanAxios.defaults.baseURL += '/guest';
}

const resetBaseURL = () => {
    badhanAxios.defaults.baseURL = baseURL
}

const isGuestEnabled = () => {
    return badhanAxios.defaults.baseURL.includes("/guest");
}

const firebaseAxios = axios.create({
    baseURL: 'https://badhan-buet-default-rtdb.firebaseio.com'
});

badhanAxios.interceptors.request.use((config) => {
    // Do something before request is sent
    console.log("%cREQUEST TO " + config.method + " " + config.url + ": ", 'color: #ff00ff', config.data, config.params);

    store.dispatch('notification/clearNotification');

    config.headers = {
        'x-auth': store.getters.getToken
    }

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

badhanAxios.interceptors.response.use((response) => {
    // Do something before request is sent
    console.log("%cRESPONSE FROM " + response.config.method + " " + response.config.url + ": ", 'color: #00ff00', response);

    return response;
}, (error) => {
    // Do something with request error
    store.dispatch('notification/notifyError', processError(error))
    if (error.response && error.response.data) {
        console.log(error.response.data)
        store.commit('errorStore/addError', {
            name: "Backend error",
            message: error.response.data.message,
            stack: error.response.config.method + " " + error.response.config.url
        });
    }

    return Promise.reject(error);
});

firebaseAxios.interceptors.request.use((config) => {
    // Do something before request is sent
    console.log("%cREQUEST TO " + config.url + ": ", 'color: #ff00ff', config.data);

    store.dispatch('notification/clearNotification');

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

firebaseAxios.interceptors.response.use((response) => {
    // Do something before request is sent
    console.log("%cRESPONSE FROM " + response.config.url + ": ", 'color: #00ff00', response);
    return response;
}, (error) => {
    // Do something with request error
    store.dispatch('notification/notifyError', processError(error))
    return Promise.reject(error);
});

/////////////////////////ROUTES////////////////////////////////////////////////////
const handlePATCHDonorsDesignation = async (payload) => {
    try {
        let response = await badhanAxios.patch("/donors/designation", payload);
        store.dispatch('notification/notifySuccess', response.data.message, {root: true});
        return true;
    } catch (error) {
        return false;
    } finally {
    }
}
const handlePATCHUsersPassword = async (payload) => {
    try {
        let response = await badhanAxios.patch("/users/password", payload);
        store.dispatch('notification/notifySuccess', response.data.message);
        return response.data;
    } catch (error) {
        return null;
    } finally {

    }
}
const handleDELETEDonors = async (payload) => {
    try {
        let response = await badhanAxios.delete("/donors", {params: payload});
        store.dispatch('notification/notifySuccess', "Successfully deleted donor", {root: true});
        return true;
    } catch (error) {
        return false;
    } finally {
    }
}

const handlePOSTDonorsPasswordRequest = async (payload) => {
    try {
        let response = await badhanAxios.post('/donors/password',payload);
        store.dispatch('notification/notifySuccess', response.data.message);
        return response.data.token;
    }catch (error) {
        return null;
    } finally {
    }
}

const handleGETDonorsDuplicate = async (payload)=>{
    try{
        let response = await badhanAxios.get('/donors/checkDuplicate', {params: payload});
        return response.data;
    }catch (e) {
        return null;
    }finally {
    }
}
const handleGETLogsByDate = async(payload)=>{
    try {
        let response = await badhanAxios.get(`/log/date/${payload.timeStamp}`);
        return response.data.logs;
    }catch (e) {
        return null;
    }finally {
    }
}
const handleGETLogs = async ()=>{
    try{
        let response = await badhanAxios.get('/log');
        return response.data.logs;
    }catch (e) {
        return null;
    }finally {
    }
}
const handleDELETESignOut = async()=>{
    try{
        let response = await badhanAxios.delete('/users/signout', {});
        return response.data;
    }catch (e) {
        return null;
    }finally {
    }
}
const handleDELETESignOutAll = async()=>{
    try{
        let response = await badhanAxios.delete('/users/signout/all');
        return response.data;
    }catch (e) {
        return null;
    }finally {
    }
}
const handlePOSTRedirection = async()=>{
    try{
        let response = await badhanAxios.post('/users/redirection');
        return response.data.token;
    }catch (e) {
        return null;
    }finally {

    }
}
const handlePATCHRedirectedAuthentication = async(payload)=>{
    try{
        let response = await badhanAxios.patch('/users/redirection', payload);
        return response.data.token;
    }catch (e) {
        return null;
    }finally {

    }
}
const handleGETDonorsMe = async()=>{
    try {
        let response = await badhanAxios.get('/donors/me');
        return response.data.donor;
    }catch (e) {
        return null;
    }finally {
    }
}
const handlePOSTSignIn = async(payload)=>{
    try{
        let response = await badhanAxios.post('/users/signin', payload);
        return response.data;
    }catch (e) {
        return null;
    }finally {

    }
}
export {
    badhanAxios,
    firebaseAxios,
    enableGuestAPI,
    resetBaseURL,
    isGuestEnabled,

    ///////////////////ROUTES////////////
    handlePATCHDonorsDesignation,
    handlePATCHUsersPassword,
    handleDELETEDonors,
    handlePOSTDonorsPasswordRequest,
    handleGETDonorsDuplicate,
    handleGETLogsByDate,
    handleGETLogs,
    handleDELETESignOut,
    handleDELETESignOutAll,
    handlePOSTRedirection,
    handlePATCHRedirectedAuthentication,
    handleGETDonorsMe,
    handlePOSTSignIn
}

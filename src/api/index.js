import axios from "axios";

import {store} from "@/store/store";
import {processError} from "../mixins/helpers";

const baseURL = process.env.VUE_APP_BADHAN_API_BASE_URL;

const badhanAxios = axios.create({
    baseURL
});

const CancelToken = axios.CancelToken;

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

    if(window.navigator.onLine){
        return config;
    }

    store.dispatch('notification/notifyError', "Network Not Available");
    return {
        ...config,
        cancelToken: new CancelToken((cancel) => cancel('Network Unavailable'))
    };
    // return {
    //     headers: {},
    //     method: config.method,
    //     url: ""
    // };

    // return Promise.reject("Network not available");
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
    let errorNotification;
    if (error.response && error.response.data) {
        store.commit('errorStore/addError', {
            name: "Backend error",
            message: error.response.data.message,
            stack: error.response.config.method + " " + error.response.config.url
        });
        errorNotification = processError(error);
    }else if(axios.isCancel(error)){
        errorNotification = "Network Unavailable";
    }else{
        errorNotification = "Unknown Error Occurred";
    }
    console.log("Axios Error:",errorNotification);

    store.dispatch('notification/notifyError',errorNotification)
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
/*
CONVENTIONS TO BE FOLLOWED
* No notifications will be sent from here
* Return response in case of successful api calls and return error.response in case of error cases.
* Method names must match with the corresponding route controller of backend
* Always send an object as payload in these methods
* All API calls must be done from this file
 */

const handlePATCHDonorsDesignation = async (payload) => {
    try {
        let response = await badhanAxios.patch("/donors/designation", payload);
        store.dispatch('notification/notifySuccess', response.data.message, {root: true});
        return true;
    } catch (error) {
        return false;
    }
}
const handlePATCHUsersPassword = async (payload) => {
    try {
        let response = await badhanAxios.patch("/users/password", payload);
        store.dispatch('notification/notifySuccess', response.data.message);
        return response.data;
    } catch (error) {
        return null;
    }
}
const handleDELETEDonors = async (payload) => {
    try {
        let response = await badhanAxios.delete("/donors", {params: payload});
        store.dispatch('notification/notifySuccess', "Successfully deleted donor", {root: true});
        return true;
    } catch (error) {
        return false;
    }
}

const handlePOSTDonorsPasswordRequest = async (payload) => {
    try {
        let response = await badhanAxios.post('/donors/password',payload);
        store.dispatch('notification/notifySuccess', response.data.message);
        return response.data.token;
    }catch (error) {
        return null;
    }
}

const handleGETDonorsDuplicate = async (payload)=>{
    try{
        let response = await badhanAxios.get('/donors/checkDuplicate', {params: payload});
        return response.data;
    }catch (e) {
        return null;
    }
}
const handleGETLogsByDate = async(payload)=>{
    try {
        let response = await badhanAxios.get(`/log/date/${payload.timeStamp}`);
        return response.data.logs;
    }catch (e) {
        return null;
    }
}
const handleGETLogs = async ()=>{
    try{
        let response = await badhanAxios.get('/log');
        return response.data.logs;
    }catch (e) {
        return null;
    }
}
const handleDELETESignOut = async()=>{
    try{
        let response = await badhanAxios.delete('/users/signout', {});
        return response.data;
    }catch (e) {
        return null;
    }
}
const handleDELETESignOutAll = async()=>{
    try{
        let response = await badhanAxios.delete('/users/signout/all');
        return response.data;
    }catch (e) {
        return null;
    }
}
const handlePOSTRedirection = async()=>{
    try{
        let response = await badhanAxios.post('/users/redirection');
        return response.data.token;
    }catch (e) {
        return null;
    }
}
const handlePATCHRedirectedAuthentication = async(payload)=>{
    try{
        let response = await badhanAxios.patch('/users/redirection', payload);
        return response.data.token;
    }catch (e) {
        return null;
    }
}
const handleGETDonorsMe = async()=>{
    try {
        let response = await badhanAxios.get('/donors/me');
        return response.data.donor;
    }catch (e) {
        return null;
    }
}
const handlePOSTSignIn = async(payload)=>{
    try{
        let response = await badhanAxios.post('/users/signin', payload);
        return response.data;
    }catch (e) {
        return null;
    }
}
const handleGETVolunteers = async()=>{
    try{
        let response = await badhanAxios.get('/volunteers');
        return response.data.volunteerList;
    }catch (e) {
        return null;
    }
}
const handlePOSTDonors = async(payload)=>{
    try {
        return await badhanAxios.post("/donors", payload);
    }catch (e) {
        return e.response;
    }
}
const handlePOSTDonations = async(payload)=>{
    try{
        return await badhanAxios.post("/donations", payload)
    }catch (e) {
        return e.response;
    }
}
const handleGETDonors = async(payload)=>{
    try{
        return await badhanAxios.get('/donors', {params:payload});
    }catch (e) {
        return e.response;
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
    handlePOSTSignIn,
    handleGETVolunteers,
    handlePOSTDonors,
    handlePOSTDonations,
    handleGETDonors

}

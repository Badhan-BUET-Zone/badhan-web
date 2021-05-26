import axios from "axios";
import {store} from "@/store/store";
import {processError} from "../mixins/helpers";

const baseURL = 'https://badhan-web.herokuapp.com';
// const baseURL = 'http://localhost:3000';

const badhanAxios = axios.create({
    baseURL
});

const enableGuestAPI = ()=>{
    badhanAxios.defaults.baseURL += '/guest';
}

const resetBaseURL = ()=>{
    badhanAxios.defaults.baseURL = baseURL
}

const firebaseAxios = axios.create({
    baseURL:'https://badhan-buet-default-rtdb.firebaseio.com'
});

badhanAxios.interceptors.request.use( (config)=>{
    // Do something before request is sent
    console.log("%cREQUEST TO "+config.url+": ",'color: #ff00ff',config.data);

    store.dispatch('notification/clearNotification');

    config.headers={
        'x-auth':store.getters.getToken
    }

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

badhanAxios.interceptors.response.use( (response)=>{
    // Do something before request is sent
    console.log("%cRESPONSE FROM "+response.config.url+": ",'color: #00ff00',response);

    return response;
},  (error)=>{
    // Do something with request error
    store.dispatch('notification/notifyError',processError(error))
    if(error.response && error.response.data){
        console.log(error.response.data)
    }

    return Promise.reject(error);
});

export{
    badhanAxios,firebaseAxios,enableGuestAPI, resetBaseURL
}

import axios from "axios";
import {store} from "@/store/store";
import {processError} from "../mixins/helpers";

const baseURL = process.env.VUE_APP_BADHAN_API_BASE_URL;

const badhanAxios = axios.create({
    baseURL
});

const enableGuestAPI = ()=>{
    badhanAxios.defaults.baseURL += '/guest';
}

const resetBaseURL = ()=>{
    badhanAxios.defaults.baseURL = baseURL
}

const isGuestEnabled = ()=>{
    return badhanAxios.defaults.baseURL.includes("/guest");
}

const firebaseAxios = axios.create({
    baseURL:'https://badhan-buet-default-rtdb.firebaseio.com'
});

badhanAxios.interceptors.request.use( (config)=>{
    // Do something before request is sent
    console.log("%cREQUEST TO "+config.method+" "+config.url+": ",'color: #ff00ff',config.data,config.params);

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
    console.log("%cRESPONSE FROM "+response.config.method+" "+response.config.url+": ",'color: #00ff00',response);

    return response;
},  (error)=>{
    // Do something with request error
    store.dispatch('notification/notifyError',processError(error))
    if(error.response && error.response.data){
        console.log(error.response.data)
        store.commit('errorStore/addError',{name:"Backend error",message:error.response.data.message,stack:error.response.config.method+" "+error.response.config.url});
    }

    return Promise.reject(error);
});

firebaseAxios.interceptors.request.use( (config)=>{
    // Do something before request is sent
    console.log("%cREQUEST TO "+config.url+": ",'color: #ff00ff',config.data);

    store.dispatch('notification/clearNotification');

    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

firebaseAxios.interceptors.response.use( (response)=>{
    // Do something before request is sent
    console.log("%cRESPONSE FROM "+response.config.url+": ",'color: #00ff00',response);
    return response;
},  (error)=>{
    // Do something with request error
    store.dispatch('notification/notifyError',processError(error))
    return Promise.reject(error);
});

export{
    badhanAxios,firebaseAxios,enableGuestAPI, resetBaseURL, isGuestEnabled
}

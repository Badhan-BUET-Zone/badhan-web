import axios from "axios";
import {store} from "@/store/store";

const badhanAxios = axios.create({
    baseURL:'https://badhan-backend.herokuapp.com'
    // baseURL:'http://localhost:3000'
});
const firebaseAxios = axios.create({
    baseURL:'https://badhan-buet-default-rtdb.firebaseio.com'
});

badhanAxios.interceptors.request.use( (config)=>{
    // Do something before request is sent
    console.log("%cREQUEST TO "+config.url+": ",'color: #ff00ff',config.data);
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
    return Promise.reject(error);
});

export{
    badhanAxios,firebaseAxios
}
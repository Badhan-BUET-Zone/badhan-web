import axios from "axios";

const badhanAxios = axios.create({
    baseURL:'https://badhan-backend.herokuapp.com'
    // baseURL:'http://localhost:3000'
});
const firebaseAxios = axios.create({
    baseURL:'https://badhan-buet-default-rtdb.firebaseio.com'
});
export{
    badhanAxios,firebaseAxios
}
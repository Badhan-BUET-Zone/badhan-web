import axios from "axios";
const badhanAxios = axios.create({
    baseURL:'https://badhan-backend.herokuapp.com'
});
const firebaseAxios = axios.create({
    baseURL:'https://badhan-buet-default-rtdb.firebaseio.com'
});
export{
    badhanAxios,firebaseAxios
}
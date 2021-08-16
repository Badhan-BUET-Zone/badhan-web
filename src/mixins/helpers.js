export const processError = (error)=>{
    if(error.response && error.response.data && error.response.data.message){
        return error.response.data.message;
    }else{
        return "Unknown error occured";
    }
}

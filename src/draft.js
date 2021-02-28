let axios = require('axios');

axios.get('https://play.google.com/store/apps/details?id=com.mmmbadhan')
    .then((response)=>{
        console.log(response);
    })
    .catch((error)=>{
        console.log(error);
    });
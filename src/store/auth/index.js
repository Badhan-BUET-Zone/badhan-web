const state={
    hello: "my name is mahathir",
    token:null,
};

const getters={
    getHello: state=>{
        return state.hello;
      },
      getToken: state=>{
        return state.token
      },
};
const mutations={
    setToken(state,token){
        state.token = token;
      },
      
  
      signOut(state) {
        state.token=null;
        state.designation="";
      }
};
const actions={

};


export default{
    state,
    actions,
    getters,
    mutations
}
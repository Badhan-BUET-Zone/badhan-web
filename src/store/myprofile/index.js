const state={
    name: null,
    studentId: null,
    lastDonation: null,
    bloodGroup: null,
    hall: null,
    phone: null,
    address: null,
    comment: null,
    designation:null,
};

const getters={
    getDesignation: state=>{
        return state.designation
      },
      getPhone: state=>{
        return state.phone
      },
      getHall: state=>{
        return state.hall
      },
      getName: state=>{
        return state.name;
      },
      getStudentId: state=>{
        return state.studentId;
      },
      getLastDonation: state=>{
        return state.lastDonation;
      },
      getBloodGroup: state=>{
        return state.bloodGroup;
      },
      getAddress: state=>{
        return state.address;
      },
      getComment: state=>{
        return state.comment;
      }
};
const mutations={
    setName(state,name){
        state.name = name;
      },
      setStudentId(state,studentId){
        state.studentId = studentId;
      },
      setLastDonation(state,lastDonation){
        state.lastDonation = lastDonation;
      },
      setBloodGroup(state,bloodGroup){
        state.bloodGroup = bloodGroup;
      },
      setAddress(state,address){
        state.address = address;
      },
      setComment(state, comment){
        state.comment= comment;
      },
      setDesignation(state,designation){
        state.designation = designation;
      },
      setPhone(state,phone){
        state.phone = phone;
      },
      setHall(state,hall){
        state.hall = hall;
      },
};
const actions={

};


export default{
    state,
    actions,
    getters,
    mutations
}
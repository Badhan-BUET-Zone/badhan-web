import {halls, designations, bloodGroups, departments} from "./constants";
import Vue from 'vue';
const getHallName = (hallCode)=>{
    return halls[hallCode];
}
const getDesignationString = (designationCode)=>{
    return designations[designationCode]
}
const getBloodGroupString = (bloodGroupCode)=>{
    if(bloodGroupCode===-1) return "All Negative";
    return bloodGroups[bloodGroupCode];
}
const idToDept = (studentID)=>{
    return departments[Number(studentID.toString().substr(2, 2))];
};

Vue.filter("getHallName", getHallName);
Vue.filter('getDesignationString',getDesignationString);
Vue.filter('getBloodGroupString',getBloodGroupString);
Vue.filter('idToDept',idToDept)

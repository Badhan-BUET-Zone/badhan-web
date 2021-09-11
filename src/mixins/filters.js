import {halls,designations, bloodGroups} from "./constants";
import Vue from 'vue';
const getHallName = (hallCode)=>{
    return halls[hallCode];
}
const getDesignationString = (designationCode)=>{
    return designations[designationCode]
}
const getBloodGroupString = (bloodGroupCode)=>{
    return bloodGroups[bloodGroupCode];
}

Vue.filter("getHallName", getHallName);
Vue.filter('getDesignationString',getDesignationString);
Vue.filter('getBloodGroupString',getBloodGroupString);

import Vue from 'vue'
import VueRouter from 'vue-router'
import HallAdmin from "@/views/HallAdmin";
import SuperAdmin from "@/views/SuperAdmin";
import Home from "@/views/Home";
import SignIn from "@/views/SignIn";
import PersonDetails from "@/components/PageBody/SearchPanel/PersonDetails/PersonDetails";

import {store} from "@/store/store";

Vue.use(VueRouter)

const routes = [
  {
    name: 'HallAdmin',
    path: '/halladmin',
    component: HallAdmin
  },
  {
    name: 'SuperAdmin',
    path: '/superadmin',
    component: SuperAdmin
  },
  {
    name: 'Home',
    path: '/home',
    component: Home,
    children:[
      {
        name: 'Details',
        path:'details',
        component: PersonDetails
      }
    ]
  },
  {
    name: 'SignIn',
    path: '/',
    component: SignIn
  }

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if(to.name!=='SignIn'&& store.getters.getToken===null){
    next({name:'SignIn'})
  }else if(to.name==='SignIn' && store.getters.getToken!==null){
    next({name:from.name});
  }else{
    next();
  }
})
export default router

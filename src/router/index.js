import Vue from 'vue'
import VueRouter from 'vue-router'
import HallAdmin from "@/views/HallAdmin";
import SuperAdmin from "@/views/SuperAdmin";
import Home from "@/views/Home";
import SignIn from "@/views/SignIn";
import PersonDetails from "@/components/PageBody/SearchPanel/PersonDetails/PersonDetails";
import Settings from "@/views/Settings";
import Credits from "@/views/Credits";
import { store } from "@/store/store";

Vue.use(VueRouter)

const routes = [
  {
    name: 'HallAdmin',
    path: '/halladmin',
    component: () => import('@/views/HallAdmin.vue')
  },
  {
    name: 'SuperAdmin',
    path: '/superadmin',
    component: () => import('@/views/SuperAdmin.vue')
  },
  {
    name: 'Home',
    path: '/home',
    component: Home,
    children: [
      {
        name: 'Details',
        path: 'details',
        component: PersonDetails
      }
    ]
  },
  {
    name: 'SignIn',
    path: '/',
    component: SignIn
  },
  {
    name: 'Settings',
    path: '/settings',
    component: () => import('@/views/Settings.vue')
  },
  {
    name: 'Credits',
    path: '/credits',
    component: () => import('@/views/Credits.vue')
  },
  {
    name: 'LogOut',
    path: '/logout',
  }

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {


  if(!store.getters.isLoggedIn && to.name!='SignIn'){
    next('/');
  }
  if(store.getters.isLoggedIn && to.name=='SignIn'){
    next('/home');
  }
  
    
  next();
  

})
export default router

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
    component: Settings
  },
  {
    name: 'Credits',
    path: '/credits',
    component: Credits
  }

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (store.getters.isLoggedIn && to.name === 'SignIn') {
    next('/home')
  }else{
    next()
  }

  if(!store.getters.isLoggedIn && to.name!='SignIn'){
    next('/');
  }else if(store.getters.isLoggedIn && to.name=='SignIn'){
    next('/home');
  }else{
    next();
  }

})
export default router

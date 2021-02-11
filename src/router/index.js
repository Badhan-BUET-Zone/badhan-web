import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import SuperAdmin from "@/views/SuperAdmin";
import HallAdmin from "@/views/HallAdmin";
import MyProfile from "@/views/MyProfile";
import SignIn from "@/views/SignIn";

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/superadmin',
    name: 'SuperAdmin',
    component: SuperAdmin
  },
  {
    path: '/halladmin',
    name: 'HallAdmin',
    component: HallAdmin
  },
  {
    path: '/myprofile',
    name: 'MyProfile',
    component: MyProfile
  },
  {
    path: '/',
    name: 'SignIn',
    component: SignIn
  }

]

const router = new VueRouter({
  routes
})

export default router

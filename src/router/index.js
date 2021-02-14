import Vue from 'vue'
import VueRouter from 'vue-router'
import HallAdmin from "@/views/HallAdmin";
import SuperAdmin from "@/views/SuperAdmin";
import Home from "@/views/Home";
import SignIn from "@/views/SignIn";
import PersonDetails from "@/components/PageBody/SearchPanel/PersonDetails/PersonDetails";


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

export default router

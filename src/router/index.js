import Vue from 'vue'
import VueRouter from 'vue-router'
import HallAdmin from "@/views/HallAdmin";
import SuperAdmin from "@/views/SuperAdmin";
import Home from "@/views/Home";
import SignIn from "@/views/SignIn";
import PersonDetails from "@/components/PageBody/SearchPanel/PersonDetails/PersonDetails";
import Settings from "../views/Settings";
import Credits from "../views/Credits";
import About from "../views/About";
import {store} from "@/store/store";

Vue.use(VueRouter)

const routes = [
    {
        name: 'HallAdmin',
        path: '/halladmin',
        component: () => import('@/views/HallAdmin.vue'),
        meta: {requiresAuth: true,title:"Hall Admin Panel"}
    },
    {
        name: 'SuperAdmin',
        path: '/superadmin',
        component: () => import('@/views/SuperAdmin.vue'),
        meta: {requiresAuth: true,title: 'Super Admin Panel'}
    },
    {
        name: 'Home',
        path: '/home',
        component: Home,
        meta: {requiresAuth: true, title: 'Home'},
        children: [
            {
                name: 'Details',
                path: 'details',
                component: PersonDetails,
                meta: {requiresAuth: true}
            }
        ]
    },
    {
        name: 'SignIn',
        path: '/',
        component: SignIn,
        meta: {requiresAuth: false, title: 'Sign In Page'}
    },
    {
        name: 'Settings',
        path: '/settings',
        component: () => import('@/views/Settings.vue'),
        meta: {requiresAuth: true, title: 'Settings'}
    },
    {
        name: 'Credits',
        path: '/credits',
        component: () => import('@/views/Credits.vue'),
        meta: {requiresAuth: false, title: "Developers of Badhan"}
    },
    {
        name: 'LogOut',
        path: '/logout',
        meta: {requiresAuth: true, title: 'Log Out Confirmation'}
    },
    {
        name: 'About',
        path: '/about',
        component: () => import('@/views/About.vue'),
        meta: {requiresAuth: false, title: "About Badhan"}
    }

]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    if(!to.meta.requiresAuth && to.name!='SignIn'){
        next();
    }else if(!store.getters.isLoggedIn && to.meta.requiresAuth){
        next('/');
    }else if(store.getters.isLoggedIn && to.name == 'SignIn'){
        next('/home');
    }else{
        next()
    }

    // if (!store.getters.isLoggedIn && to.name != 'SignIn') {
    //     next('/');
    // }
    // if (store.getters.isLoggedIn && to.name == 'SignIn') {
    //     next('/home');
    // }
    // next();


})
export default router

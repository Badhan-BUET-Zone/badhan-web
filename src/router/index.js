import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/views/Home";

import SignInCover from "@/views/SignInCover";
import PersonDetails from "@/components/Home/SearchPanel/PersonDetails/PersonDetails";
import {store} from "@/store/store";

Vue.use(VueRouter)

const routes = [
    {
        name: 'HallAdminList',
        path: '/halladminlist',
        component: () => import('@/views/HallAdminList.vue'),
        meta: {
            requiresAuth: true,
            title: 'List of Hall Admins',
            designation: 1
        }
    },
    {
        name: 'Home',
        path: '/home',
        component: Home,
        meta: {
            requiresAuth: true,
            title: 'Home',
            designation: 1
        },
        children: [
            {
                name: 'Details',
                path: 'details',
                component: PersonDetails,
                meta: {
                    requiresAuth: true,
                    designation: 1
                }
            }
        ]
    },
    {
        name: 'SignIn',
        path: '/',
        component: SignInCover,
        meta: {
            requiresAuth: false,
            title: 'Sign In Page',
            designation: 0
        }
    },
    {
        name: 'Statistics',
        path: '/statistics',
        component: () => import('@/views/Statistics.vue'),
        meta: {
            requiresAuth: true,
            title: 'Statistics',
            designation: 3
        }
    },
    {
        name: 'Credits',
        path: '/credits',
        component: () => import('@/views/Credits.vue'),
        meta: {
            requiresAuth: false,
            title: "Developers of Badhan",
            designation: 0
        }
    },
    {
        name: 'About',
        path: '/about',
        component: () => import('@/views/About.vue'),
        meta: {
            requiresAuth: false,
            title: "About Badhan",
            designation: 0
        }
    },
    {
        name: 'CreateDonor',
        path: '/createdonor',
        component: () => import('@/views/CreateDonor.vue'),
        meta: {
            requiresAuth: true,
            title: 'Create a Donor',
            designation: 1
        }
    },
    {
        name: 'VolunteerList',
        path: '/volunteerlist',
        component: () => import('@/views/VolunteerList.vue'),
        meta: {
            requiresAuth: true,
            title: 'List of Volunteers',
            designation: 1
        }
    },
    {
        name: 'Donor Creation',
        path: '/donorCreation',
        component: () => import('@/views/DonorCreation.vue'),
        meta:{
            requiresAuth: true,
            title: 'Donor Creation',
            designation: 1
        }
    },
    {
        name: 'Archive',
        path: '/archive',
        component: () => import('@/views/Archive.vue'),
        meta: {
            requiresAuth: true,
            title: 'Archived Donors',
            designation: 2
        }
    },
    {
        name: 'Redirection',
        path: '/redirection',
        component: () => import('@/views/Redirection.vue'),
        meta: {
            requiresAuth: false,
            title: 'Redirection',
            designation: 0,
        }
    },
    {
        name: 'NotFound',
        path: '/*',
        component: () => import('@/views/NotFound.vue'),
        meta: {
            requiresAuth: false,
            title: "404 Not Found",
            designation: 0
        }
    },

]

const router = new VueRouter({
    routes
})
router.beforeEach((to, from, next) => {
    if (!to.meta.requiresAuth && to.name != 'SignIn') {
        next();
    } else if (!store.getters.isLoggedIn && to.meta.requiresAuth) {
        next('/');
    } else if (store.getters.isLoggedIn && to.name == 'SignIn') {
        next('/home');
    } else {
        next();
    }
})
export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/views/Home";

import SignInCover from "@/views/SignInCover";
import Details from "../views/Home/Details";
import {store} from "@/store/store";
import LogsByDate from "../views/Statistics/LogsByDate";
import RecentLogs from "../views/Statistics/RecentLogs";
import Stats from "../views/Statistics/Stats";
import VolunteersAll from "../views/Statistics/VolunteersAll";

Vue.use(VueRouter)

const routes = [
    {
        name: 'HallAdminList',
        path: '/halladminlist',
        component: () => import('@/views/HallAdminList.vue'),
        meta: {
            requiresAuth: true,
            title: 'List of Hall Admins',
            designation: 1,
            reRouteIfAuthorized: false,
        }
    },
    {
        name: 'Home',
        path: '/home',
        component: Home,
        meta: {
            requiresAuth: true,
            title: 'Home',
            designation: 1,
            reRouteIfAuthorized: false,
        },
        children: [
            {
                name: 'Details',
                path: 'details',
                // component: PersonDetails,
                component: Details,
                meta: {
                    title: 'Donor Details',
                    requiresAuth: true,
                    designation: 1,
                    reRouteIfAuthorized: false,
                }
            }
        ]
    },
    {
        name: 'MyProfile',
        path: '/myProfile',
        // component: PersonDetails,
        component: () => import('@/views/MyProfile.vue'),
        meta: {
            requiresAuth: true,
            title: 'My Profile',
            designation: 1,
            reRouteIfAuthorized: false,
        },
    },
    {
        name: 'SignIn',
        path: '/',
        component: SignInCover,
        meta: {
            requiresAuth: false,
            title: 'Sign In Page',
            designation: 0,
            reRouteIfAuthorized: true,
        }
    },
    {
        name: 'Statistics',
        path: '/statistics',
        component: () => import('@/views/Statistics.vue'),
        meta: {
            requiresAuth: true,
            title: 'Statistics',
            designation: 3,
            reRouteIfAuthorized: false,
        },
        children: [
            {
                name: 'LogsByDate',
                path: 'logsByDate',
                component: LogsByDate,
                meta: {
                    title: 'Logs by Date',
                    requiresAuth: true,
                    designation: 3,
                    reRouteIfAuthorized: false,
                }
            },
            {
                name: 'RecentLogs',
                path: 'recentLogs',
                component: RecentLogs,
                meta: {
                    title: 'Recent Logs',
                    requiresAuth: true,
                    designation: 3,
                    reRouteIfAuthorized: false,
                }
            },
            {
                name: 'Stats',
                path: 'stats',
                component: Stats,
                meta: {
                    title: 'Account Stats',
                    requiresAuth: true,
                    designation: 3,
                    reRouteIfAuthorized: false,
                }
            },
            {
                name:'VolunteersAll',
                path: 'volunteersAll',
                component: VolunteersAll,
                meta:{
                    title:'All Volunteers',
                    requiresAuth: true,
                    designation: 3,
                    reRouteIfAuthorized: false,
                }
            }
        ]
    },
    {
        name: 'Credits',
        path: '/credits',
        component: () => import('@/views/Credits.vue'),
        meta: {
            requiresAuth: false,
            title: "Developers of Badhan",
            designation: 0,
            reRouteIfAuthorized: false,
        }
    },
    {
        name: 'About',
        path: '/about',
        component: () => import('@/views/About.vue'),
        meta: {
            requiresAuth: false,
            title: "About Badhan",
            designation: 0,
            reRouteIfAuthorized: false,
        }
    },

    {
        name: 'VolunteerList',
        path: '/volunteerlist',
        component: () => import('@/views/VolunteerList.vue'),
        meta: {
            requiresAuth: true,
            title: 'List of Volunteers',
            designation: 1,
            reRouteIfAuthorized: false,
        }
    },
    {
        name: 'Donor Creation',
        path: '/donorCreation',
        component: () => import('@/views/DonorCreation.vue'),
        meta: {
            requiresAuth: true,
            title: 'Donor Creation',
            designation: 1,
            reRouteIfAuthorized: false,
        }
    },
    {
        name: 'SingleDonorCreation',
        path: '/singleDonorCreation',
        component: () => import('@/views/SingleDonorCreation.vue'),
        meta: {
            requiresAuth: true,
            title: 'Create Donor',
            designation: 1,
            reRouteIfAuthorized: false,
        }
    },
    {
        name: 'Archive',
        path: '/archive',
        component: () => import('@/views/Archive.vue'),
        meta: {
            requiresAuth: true,
            title: 'Archived Donors',
            designation: 2,
            reRouteIfAuthorized: false,
        }
    },
    {
        name: 'PasswordReset',
        path: '/passwordReset',
        component: () => import('@/views/PasswordReset.vue'),
        meta: {
            requiresAuth: false,
            title: 'Set Your Password',
            designation: 0,
            reRouteIfAuthorized: true,
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
            reRouteIfAuthorized: false,
        }
    },
    {
        name: 'DevConsole',
        path: '/devconsole',
        component: () => import('@/views/DevConsole.vue'),
        meta: {
            requiresAuth: true,
            title: 'Developer Console',
            designation: 3,
            reRouteIfAuthorized: false,
        }
    },
    {
        name: 'NotFound',
        path: '/*',
        component: () => import('@/views/NotFound.vue'),
        meta: {
            requiresAuth: false,
            title: "404 Not Found",
            designation: 0,
            reRouteIfAuthorized: false,
        }
    },

]

const router = new VueRouter({
    routes
})
router.beforeEach(async (to, from, next) => {
    if (!to.meta.requiresAuth && to.name != 'SignIn') {
        next();
    }

    if (!store.getters.getIsLoggedIn) {
        await store.dispatch('autoLogin');
    }

    if (!store.getters.getIsLoggedIn && to.meta.requiresAuth) {
        store.commit('setAutoRedirectionPath', to.fullPath);
        next('/');
    } else if (store.getters.getIsLoggedIn && (to.meta.reRouteIfAuthorized || to.meta.designation > store.getters.getDesignation)) {
        next('/home');
    } else {
        next();
    }
})


export default router;

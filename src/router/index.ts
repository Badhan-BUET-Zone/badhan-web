import Vue from 'vue'
import VueRouter, {RouteConfig, Route, NavigationGuardNext} from 'vue-router'
import Home from '@/views/Home.vue'

import SignInCover from '../views/SignInCover.vue'
import Details from '../views/Home/Details.vue'
import { store } from '@/store/store'

Vue.use(VueRouter)

interface RouteMeta{
  requiresAuth: boolean,
  title: string,
  designation: number,
  reRouteIfAuthorized: boolean
}

type CustomRouteConfig = RouteConfig & {
  meta: RouteMeta
}

interface CustomRoute extends Route{
  meta: RouteMeta
}

const routes: CustomRouteConfig[] = [
  {
    name: 'ActiveDonors',
    path: '/activeDonors',
    component: () => import('../views/ActiveDonors.vue'),
    meta: {
      requiresAuth: true,
      title: 'Active Donors',
      designation: 1,
      reRouteIfAuthorized: false
    },
    children: [
      {
        name: 'ActiveDonorDetails',
        path: 'details',
        component: Details,
        meta: {
          title: 'Donor Details',
          requiresAuth: true,
          designation: 1,
          reRouteIfAuthorized: false
        }
      }
    ]
  },
  {
    name: 'MembersPage',
    path: '/members',
    component: () => import('../views/Members.vue'),
    meta: {
      requiresAuth: true,
      title: 'Members of Badhan BUET',
      designation: 1,
      reRouteIfAuthorized: false
    }
  },
  {
    name: 'PublicContacts',
    path: '/contacts',
    component: () => import('../views/PublicContacts.vue'),
    meta: {
      requiresAuth: false,
      title: 'Contact Badhan BUET Zone',
      designation: 0,
      reRouteIfAuthorized: false
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
      reRouteIfAuthorized: false
    },
    children: [
      {
        name: 'DetailsPage',
        path: 'details',
        component: Details,
        meta: {
          title: 'Donor Details',
          requiresAuth: true,
          designation: 1,
          reRouteIfAuthorized: false
        }
      }
    ]
  },
  {
    name: 'MyProfile',
    path: '/myProfile',
    component: () => import('../views/MyProfile.vue'),
    meta: {
      requiresAuth: true,
      title: 'My Profile',
      designation: 1,
      reRouteIfAuthorized: false
    }
  },
  {
    name: 'SignIn',
    path: '/',
    component: SignInCover,
    meta: {
      requiresAuth: false,
      title: 'Sign In Page',
      designation: 0,
      reRouteIfAuthorized: true
    }
  },
  {
    name: 'StatisticsPage',
    path: '/statistics',
    component: () => import('../views/Statistics.vue'),
    meta: {
      requiresAuth: true,
      title: 'Statistics',
      designation: 3,
      reRouteIfAuthorized: false
    },
    children: [
      {
        name: 'LogsByDate',
        path: 'logsByDate',
        component: () => import('../views/Statistics/LogsByDate.vue'),
        meta: {
          title: 'Logs by Date',
          requiresAuth: true,
          designation: 3,
          reRouteIfAuthorized: false
        }
      },
      {
        name: 'StatsPage',
        path: 'stats',
        component: () => import('../views/Statistics/Stats.vue'),
        meta: {
          title: 'Account Stats',
          requiresAuth: true,
          designation: 3,
          reRouteIfAuthorized: false
        }
      },
      {
        name: 'VolunteersAll',
        path: 'membersAll',
        component: () => import('../views/Statistics/VolunteersAll.vue'),
        meta: {
          title: 'All Members',
          requiresAuth: true,
          designation: 3,
          reRouteIfAuthorized: false
        }
      },
      {
        name: 'DonationsReport',
        path: 'report',
        component: () => import('../views/Statistics/DonationReport.vue'),
        meta: {
          title: 'Donation Report',
          requiresAuth: true,
          designation: 3,
          reRouteIfAuthorized: false
        }
      }
    ]
  },
  {
    name: 'CreditsPage',
    path: '/credits',
    component: () => import('../views/Credits.vue'),
    meta: {
      requiresAuth: false,
      title: 'Developers of Badhan',
      designation: 0,
      reRouteIfAuthorized: false
    }
  },
  {
    name: 'AboutPage',
    path: '/about',
    component: () => import('../views/About.vue'),
    meta: {
      requiresAuth: false,
      title: 'About Badhan',
      designation: 0,
      reRouteIfAuthorized: false
    }
  },
  {
    name: 'Donor Creation',
    path: '/donorCreation',
    component: () => import('../views/DonorCreation.vue'),
    meta: {
      requiresAuth: true,
      title: 'Donor Creation',
      designation: 1,
      reRouteIfAuthorized: false
    }
  },
  {
    name: 'SingleDonorCreation',
    path: '/singleDonorCreation',
    component: () => import('../views/SingleDonorCreation.vue'),
    meta: {
      requiresAuth: true,
      title: 'Create Donor',
      designation: 1,
      reRouteIfAuthorized: false
    },
    children: [
      {
        name: 'DuplicateDetails',
        path: 'duplicateDetails',
        component: () => import('../views/SingleDonorCreation/DuplicateDetails.vue'),
        meta: {
          title: 'Duplicate Details',
          requiresAuth: true,
          designation: 1,
          reRouteIfAuthorized: false
        }
      }
    ]
  },
  {
    name: 'ArchivePage',
    path: '/archive',
    component: () => import('../views/Archive.vue'),
    meta: {
      requiresAuth: true,
      title: 'Archived Donors',
      designation: 2,
      reRouteIfAuthorized: false
    }
  },
  {
    name: 'PasswordReset',
    path: '/passwordReset',
    component: () => import('../views/PasswordReset.vue'),
    meta: {
      requiresAuth: false,
      title: 'Set Your Password',
      designation: 0,
      reRouteIfAuthorized: true
    }
  },
  {
    name: 'ForgotPassword',
    path: '/forgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
    meta: {
      requiresAuth: false,
      title: 'Password Recovery',
      designation: 0,
      reRouteIfAuthorized: true
    }
  },
  {
    name: 'RedirectionPage',
    path: '/redirection',
    component: () => import('../views/Redirection.vue'),
    meta: {
      requiresAuth: false,
      title: 'Redirection',
      designation: 0,
      reRouteIfAuthorized: false
    }
  },
  {
    name: 'DevConsole',
    path: '/devconsole',
    component: () => import('../views/DevConsole.vue'),
    meta: {
      requiresAuth: true,
      title: 'Developer Console',
      designation: 3,
      reRouteIfAuthorized: false
    }
  },
  {
    name: 'AdminConsole',
    path: '/adminconsole',
    component: () => import('../views/AdminConsole.vue'),
    meta: {
      requiresAuth: true,
      title: 'Admin Console',
      designation: 3,
      reRouteIfAuthorized: false
    }
  },
  {
    name: 'NotFound',
    path: '/*',
    component: () => import('../views/NotFound.vue'),
    meta: {
      requiresAuth: false,
      title: '404 Not Found',
      designation: 0,
      reRouteIfAuthorized: false
    }
  }

]

const router = new VueRouter({
  routes
})

router.beforeEach(async (to: Route, from: Route, next: NavigationGuardNext<Vue>) => {
  const customRouteTo = to as CustomRoute
  if (!customRouteTo.meta.requiresAuth && customRouteTo.name !== 'SignIn') {
    next()
  }

  if (!store.getters.getToken && customRouteTo.meta.requiresAuth) {
    store.commit('setAutoRedirectionPath', to.fullPath)
    next('/')
  } else if (store.getters.getToken &&
      (customRouteTo.meta.reRouteIfAuthorized || customRouteTo.meta.designation > store.getters.getDesignation)) {
    next('/home')
  } else {
    next()
  }
})

export default router

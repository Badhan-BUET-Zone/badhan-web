<template>
  <fragment>
    <v-app-bar color="primary" dark app clipped-left collapse-on-scroll class="rounded-b-xl">
      <v-app-bar-nav-icon id="hamburgerButtonId" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <img src="../assets/images/badhanlogo.png" alt="Badhan" style="height: 40px; width: 40px" class="mr-4">
      <v-toolbar-title>Badhan BUET Zone</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu right rounded>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" :loading="getLoadingFlag" id="topBarVerticalDotsId">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list rounded>
          <v-list-item @click="signOutModalPrompted" id="signOutButtonId">
            <v-list-item-icon>
              <v-icon>
                mdi-logout
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sign Out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" left app clipped class="rounded-r-xl">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ getName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-chip color="secondary" class="ma-1">
              {{ getDesignation|getDesignationString }}
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list nav dense rounded>
        <fragment v-for="(menu) in menusForAll" :key="menu.icon">
          <fragment v-if="!menu.subLinks && getDesignation >= menu.designation">
            <v-list-item-group active-class="primary--text text--accent-4">
              <v-list-item link :to="menu.to" :id="menu.id" style="text-decoration: none">
                <v-list-item-icon>
                  <v-icon>{{ menu.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ menu.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </fragment>
          <fragment v-else-if="getDesignation >= menu.designation">
            <v-list-group prepend-icon="mdi-star" no-action :id="menu.id">
              <template v-slot:activator>
                <v-list-item-title>{{ menu.text }}</v-list-item-title>
              </template>
              <fragment v-for="(subLink) in menu.subLinks" :key="subLink.to">
                <span v-if="getDesignation >= subLink.designation">
                  <v-list-item link :to="subLink.to" style="text-decoration: none" :id="subLink.id">
                    <v-list-item-icon><v-icon>{{ subLink.icon }}</v-icon></v-list-item-icon>
                    <v-list-item-content><v-list-item-title>{{ subLink.text }}</v-list-item-title></v-list-item-content>
                  </v-list-item>
                </span>
              </fragment>
            </v-list-group>
          </fragment>
        </fragment>
      </v-list>
      <v-list>
        <v-list-item>
          <v-btn rounded depressed small @click="toggleTheme">
            <v-icon left v-if="!darkTheme">
              mdi-brightness-3
            </v-icon>
            <v-icon left v-else>
              mdi-brightness-5
            </v-icon>
            Activate {{ darkTheme ? 'Day' : 'Night' }} Mode
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </fragment>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { isGuestEnabled } from '@/api'
import ldb from '../localDatabase'
import { environmentService } from '@/mixins/environment'

export default {

  data: function () {
    return {
      theme: this.$vuetify.theme.dark,
      drawer: !this.$isMobile(),
      signOutModalFlag: false,
      signOutAllModalFlag: false,
      menusForAll: [
        {
          icon: 'mdi-home',
          text: 'Home',
          to: '/home',
          id: 'homeNavigationId',
          designation: 1
        },
        {
          icon: 'mdi-bookmark',
          text: 'Active Donors',
          to: '/activeDonors',
          id: 'activeDonorNavigationId',
          designation: 1
        },
        {
          icon: 'mdi-plus',
          text: 'Donor Creation',
          to: '/singleDonorCreation',
          id: 'donorCreationNavigationId',
          designation: 1,
          subLinks: [{
            icon: 'mdi-shape-square-plus',
            text: 'Single Donor Creation',
            to: '/singleDonorCreation',
            id: 'singleDonorCreationId',
            designation: 1
          },
          {
            icon: 'mdi-shape-rectangle-plus',
            text: 'Advanced Donor Creation',
            to: '/donorCreation',
            id: 'donorCreationId',
            designation: 1
          }
          ]
        },
        {
          icon: 'mdi-account-group',
          text: 'Members',
          to: '/members',
          id: 'membersNavigationId',
          designation: 1
        },
        {
          icon: 'mdi-earth',
          text: 'Public Contacts',
          to: '/contacts',
          id: 'publicContactsNavigationId',
          designation: 1
        },
        {
          icon: 'mdi-account',
          text: 'My Profile',
          to: '/myProfile',
          id: 'myProfileNavigationId',
          designation: 1
        },
        {
          icon: 'mdi-hand-heart',
          text: 'Credits',
          to: '/credits',
          id: 'creditsNavigationId',
          designation: 1
        },
        {
          icon: 'mdi-information',
          text: 'About',
          to: '/about',
          id: 'aboutNavigationId',
          designation: 1
        },
        {
          icon: 'mdi-star',
          text: 'Super Admin',
          id: 'superAdminId',
          designation: 3,
          subLinks: [
            {
              icon: 'mdi-chart-bar',
              text: 'Statistics',
              to: '/statistics/logsByDate',
              id: 'statisticsNavigationId',
              designation: 3
            },
            {
              icon: 'mdi-shield-crown-outline',
              text: 'Admin Console',
              to: '/adminconsole',
              id: 'adminConsoleNavigationId',
              designation: 3
            },
            {
              icon: 'mdi-developer-board',
              text: 'Dev Console',
              to: '/devconsole',
              id: 'devConsoleNavigationId',
              designation: 3
            }]
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getLoadingFlag', 'getName', 'getDesignation', 'getID', 'getToken']),
    darkTheme: {
      // getter
      get () {
        return this.$vuetify.theme.dark
      },
      // setter
      set (newValue) {
        this.$vuetify.theme.dark = newValue
        ldb.theme.save(newValue)
      }
    },
    isGuestEnabled () {
      return isGuestEnabled()
    }
  },
  methods: {
    ...mapActions('notification', ['notifySuccess']),
    ...mapActions(['logout', 'logoutAll', 'requestRedirectionToken']),
    ...mapMutations('confirmationBox', ['setConfirmationMessage']),
    toggleTheme () {
      this.theme = !this.theme
      this.$vuetify.theme.dark = this.theme
      ldb.theme.save(this.theme)
    },
    async myProfileclicked () {
      await this.$router.push({
        path: '/home/details',
        query: { id: this.getID }
      })
    },
    async signOutModalPrompted () {
      this.setConfirmationMessage({
        confirmationMessage: 'Sign out?',
        confirmationAction: this.signOutModalConfirmed
      })
    },
    async signOutModalConfirmed () {
      await this.logout()
      await this.$router.push('/')
    },
    async signOutAllModalPrompted () {
      this.signOutAllModalFlag = true
    },
    async signOutAllModalCanceled () {
      this.signOutAllModalFlag = false
    },
    async signOutAllModalConfirmed () {
      this.signOutAllModalFlag = false
      await this.logoutAll()
      await this.$router.push('/')
    },
    async goToWebClicked () {
      const redirectionTokenResponse = await this.requestRedirectionToken()
      if (redirectionTokenResponse.status !== 201) return
      const routeData = this.$router.resolve({
        name: 'RedirectionPage',
        query: {
          token: redirectionTokenResponse.data.token,
          payload: this.$route.fullPath
        }
      })
      window.open(environmentService.getFrontendBaseURL() + routeData.href, '_blank')
    }
  },
  watch: {
    group () {
      this.drawer = false
    }
  }
}
</script>

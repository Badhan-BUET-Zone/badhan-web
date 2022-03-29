<template>
  <div>
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
          <v-list-item @click="goToWebClicked" v-if="(isNative || $getEnvironmentName() === 'development') && !isGuestEnabled ">
            <v-list-item-icon>
              <v-icon>
                mdi-web
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Go to Web</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
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
        <v-list-item-group active-class="primary--text text--accent-4">
          <v-list-item v-for="(menu) in menusForAll" :key="menu.icon" link :to="menu.to" :id="menu.id" style="text-decoration: none">
            <v-list-item-icon><v-icon>{{menu.icon}}</v-icon></v-list-item-icon>
            <v-list-item-content><v-list-item-title>{{menu.text}}</v-list-item-title></v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-list-group prepend-icon="mdi-star" no-action v-if="getDesignation===3" id="superAdminNavigationId">
          <template v-slot:activator>
            <v-list-item-title>Super Admin</v-list-item-title>
          </template>
          <span v-for="(menu) in menusForSuperAdmin" :key="menu.icon">
            <v-list-item link :to="menu.to" style="text-decoration: none" :id="menu.id">
              <v-list-item-icon><v-icon>{{menu.icon}}</v-icon></v-list-item-icon>
              <v-list-item-content><v-list-item-title>{{menu.text}}</v-list-item-title></v-list-item-content>
            </v-list-item>
          </span>
        </v-list-group>
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
            Activate {{darkTheme?'Day':'Night'}} Mode
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>

import { mapActions, mapGetters, mapMutations } from 'vuex'
import { getIsNative } from '../plugins/android_support'
import { isGuestEnabled } from '../api'
import ldb from '../localDatabase'

export default {

  data: function () {
    return {
      theme: this.$vuetify.theme.dark,
      drawer: !this.$isMobile(),
      signOutModalFlag: false,
      signOutAllModalFlag: false,
      menusForAll: [
        { icon: 'mdi-home', text: 'Home', to: '/home', id: 'homeNavigationId' },
        { icon: 'mdi-bookmark', text: 'Active Donors', to: '/activeDonors', id: 'activeDonorNavigationId' },
        { icon: 'mdi-plus', text: 'Donor Creation', to: '/singleDonorCreation', id: 'donorCreationNavigationId' },
        { icon: 'mdi-account-group', text: 'Members', to: '/members', id: 'membersNavigationId' },
        { icon: 'mdi-earth', text: 'Public Contacts', to: '/contacts', id: 'publicContactsNavigationId' },
        { icon: 'mdi-account', text: 'My Profile', to: '/myProfile', id: 'myProfileNavigationId' },
        { icon: 'mdi-hand-heart', text: 'Credits', to: '/credits', id: 'creditsNavigationId' },
        { icon: 'mdi-information', text: 'About', to: '/about', id: 'aboutNavigationId' }
      ],
      menusForSuperAdmin: [
        { icon: 'mdi-chart-bar', text: 'Statistics', to: '/statistics/logsByDate', id: 'statisticsNavigationId' },
        { icon: 'mdi-developer-board', text: 'Dev Console', to: '/devconsole', id: 'devConsoleNavigationId' }
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

    isNative () {
      return getIsNative()
    },
    isGuestEnabled () {
      return isGuestEnabled()
    }
  },
  mounted () {
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
      await this.$router.push({ path: '/home/details', query: { id: this.getID } })
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
        name: 'Redirection',
        query: { token: redirectionTokenResponse.data.token, payload: this.$route.fullPath }
      })
      window.open(process.env.VUE_APP_FRONTEND_BASE + routeData.href, '_blank')
    }
  },
  watch: {
    group () {
      this.drawer = false
    }
  }
}
</script>

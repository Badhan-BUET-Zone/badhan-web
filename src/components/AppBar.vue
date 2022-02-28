<template>
  <div>
    <v-app-bar color="primary" dark app clipped-left collapse-on-scroll class="rounded-b-xl">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <img src="../assets/images/badhanlogo.png" alt="Badhan" style="height: 40px; width: 40px" class="mr-4">
      <v-toolbar-title>Badhan BUET Zone</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu right rounded>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" :loading="getLoadingFlag">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list rounded>
          <v-list-item @click="goToWebClicked" v-if="(isNative || $getEnvironmentName === 'development')&& !isGuestEnabled ">
            <v-list-item-icon>
              <v-icon>
                mdi-web
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Go to Web</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="signOutModalPrompted">
            <v-list-item-icon>
              <v-icon>
                mdi-logout
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sign Out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
<!--          <v-list-item @click="signOutAllModalPrompted">-->
<!--            <v-list-item-icon>-->
<!--              <v-icon>-->
<!--                mdi-logout-->
<!--              </v-icon>-->
<!--            </v-list-item-icon>-->
<!--            <v-list-item-content>-->
<!--              <v-list-item-title>Sign Out From All Devices</v-list-item-title>-->
<!--            </v-list-item-content>-->
<!--          </v-list-item>-->
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
          <v-list-item v-for="(menu) in menusForAll" :key="menu.icon" link :to="menu.to" style="text-decoration: none">
            <v-list-item-icon><v-icon>{{menu.icon}}</v-icon></v-list-item-icon>
            <v-list-item-content><v-list-item-title>{{menu.text}}</v-list-item-title></v-list-item-content>
          </v-list-item>
          <span v-for="(menu) in menusForSuperAdmin" :key="menu.icon">
            <v-list-item v-if="getDesignation===3"  link :to="menu.to" style="text-decoration: none">
              <v-list-item-icon><v-icon>{{menu.icon}}</v-icon></v-list-item-icon>
              <v-list-item-content><v-list-item-title>{{menu.text}}</v-list-item-title></v-list-item-content>
            </v-list-item>
          </span>

        </v-list-item-group>
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
    <Dialog
        :message="'Sign out?'"
        :canceled="signOutModalCanceled"
        :dialog-opened="signOutModalFlag"
        :confirmed="signOutModalConfirmed">
    </Dialog>
    <Dialog
        :message="'Sign out from all devices?'"
        :canceled="signOutAllModalCanceled"
        :dialog-opened="signOutAllModalFlag"
        :confirmed="signOutAllModalConfirmed">
    </Dialog>

  </div>
</template>

<script>

import { mapActions, mapGetters } from 'vuex'
import { getIsNative } from '../plugins/android_support'
import { isGuestEnabled } from '../api'
import Dialog from './Dialog'
import ldb from '../localDatabase'

export default {
  components: { Dialog },
  data: function () {
    return {
      theme: this.$vuetify.theme.dark,
      drawer: !this.$isMobile(),
      signOutModalFlag: false,
      signOutAllModalFlag: false,
      menusForAll: [
        { icon: 'mdi-home', text: 'Home', to: '/home' },
        { icon: 'mdi-bookmark', text: 'Active Donors', to: '/activeDonors' },
        { icon: 'mdi-plus', text: 'Donor Creation', to: '/singleDonorCreation' },
        { icon: 'mdi-account-group', text: 'Members', to: '/members' },
        { icon: 'mdi-earth', text: 'Public Contacts', to: '/contacts' },
        { icon: 'mdi-account', text: 'My Profile', to: '/myProfile' },
        { icon: 'mdi-hand-heart', text: 'Credits', to: '/credits' },
        { icon: 'mdi-information', text: 'About', to: '/about' }
      ],
      menusForSuperAdmin: [
        { icon: 'mdi-chart-bar', text: 'Statistics', to: '/statistics/logsByDate' },
        { icon: 'mdi-developer-board', text: 'Dev Console', to: '/devconsole' }
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
    toggleTheme () {
      this.theme = !this.theme
      this.$vuetify.theme.dark = this.theme
      ldb.theme.save(this.theme)
    },
    async myProfileclicked () {
      await this.$router.push({ path: '/home/details', query: { id: this.getID } })
    },
    async signOutModalPrompted () {
      this.signOutModalFlag = true
    },
    async signOutModalCanceled () {
      this.signOutModalFlag = false
    },
    async signOutModalConfirmed () {
      this.signOutModalFlag = false
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
      const redirectionToken = await this.requestRedirectionToken()
      const routeData = this.$router.resolve({
        name: 'Redirection',
        query: { token: redirectionToken, payload: this.$route.fullPath }
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

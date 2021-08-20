<template>
  <div>
    <v-app-bar
        color="primary"
        dark
        app
        clipped-left
        collapse-on-scroll
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>


      <img src="../assets/images/badhanlogo.png" alt="Badhan" style="height: 40px; width: 40px" class="mr-4">

      <v-toolbar-title>Badhan BUET Zone</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-menu
          right
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              :loading="getLoadingFlag"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="goToWebClicked" v-if="(isNative || $isDevelopmentEnv())&& !isGuestEnabled ">
<!--          <v-list-item @click="goToWebClicked">-->
            <v-list-item-icon>
              <v-icon>
                mdi-web
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Go to Web</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="signOutClicked">
            <v-list-item-icon>
              <v-icon>
                mdi-logout
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sign Out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="signOutAllClicked">
            <v-list-item-icon>
              <v-icon>
                mdi-logout
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Sign Out From All Devices</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        left
        app
        clipped
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ getName }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <v-chip color="secondary" class="ma-1">
              <span v-if="getDesignation===2">Hall admin</span>
              <span v-else-if="getDesignation===3">Super admin</span>
              <span v-else-if="getDesignation===1">Volunteer</span>
              <span v-else-if="getDesignation===0">Donor</span>
            </v-chip>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list
          nav
          dense
      >
        <v-list-item-group
            active-class="primary--text text--accent-4"
        >
          <v-list-item link to="/home" style="text-decoration: none">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/singleDonorCreation" style="text-decoration: none">
            <v-list-item-icon>
              <v-icon>mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Donor Creation</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/volunteerlist" style="text-decoration: none">
            <v-list-item-icon>
              <v-icon>mdi-account-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>List of Volunteers</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/halladminlist" style="text-decoration: none">
            <v-list-item-icon>
              <v-icon>mdi-star</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>List of Hall Admins</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/archive" style="text-decoration: none">
            <v-list-item-icon>
              <v-icon>mdi-archive</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Archive</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/myProfile" style="text-decoration: none">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>My Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/statistics" v-if="getDesignation===3" style="text-decoration: none">
            <v-list-item-icon>
              <v-icon>mdi-chart-bar</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Statistics</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/devconsole" v-if="getDesignation===3" style="text-decoration: none">
            <v-list-item-icon>
              <v-icon>mdi-developer-board</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Dev Console</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/credits" style="text-decoration: none">
            <v-list-item-icon>
              <v-icon>mdi-hand-heart</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Credits</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/about" style="text-decoration: none">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>About</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

  </div>
</template>

<script>

import {mapActions, mapGetters} from 'vuex';
import {isNative} from '@/plugins/android_support';
import {isGuestEnabled} from "../api";

export default {
  data: () => ({
    drawer: false,
  }),
  computed: {
    ...mapGetters(['getLoadingFlag', 'getName', 'getDesignation', 'getID','getToken']),
    isNative(){
      return isNative();
    },
    isGuestEnabled(){
      return isGuestEnabled();
    }
  },
  mounted() {
    this.drawer = !this.$isMobile();
  },
  methods: {
    ...mapActions('notification', ['notifySuccess']),
    ...mapActions(['logout', 'logoutAll','requestRedirectionToken']),
    async myProfileclicked() {
      await this.$router.push({path: '/home/details', query: {id: this.getID}});
    },
    async signOutClicked() {
      this.$bvModal.msgBoxConfirm('Confirm Logout?', {
        centered: true
      })
          .then(async (value) => {
            if (value === true) {
              await this.logout();
              this.$router.push('/');
            }
          })
    },
    async signOutAllClicked() {
      let value = await this.$bvModal.msgBoxConfirm('Confirm logout from all devices?', {
        centered: true
      });
      if (value === true) {
        await this.logoutAll();
        this.$router.push('/');
      }
    },
    async goToWebClicked(){
      let redirectionToken = await this.requestRedirectionToken();
      let routeData;
      routeData = this.$router.resolve({
        name: 'Redirection',
        query: {token: redirectionToken, payload: this.$route.fullPath}
      });
      window.open(process.env.VUE_APP_FRONTEND_BASE+routeData.href, '_blank');

    }
  },
  watch: {
    group() {
      this.drawer = false
    },
  },
}
</script>

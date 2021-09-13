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
          <v-list-item @click="goToWebClicked" v-if="(isNative || $isDevelopmentEnv())&& !isGuestEnabled ">
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
          <v-list-item @click="signOutAllModalPrompted">
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
          <v-list-item v-for="(menu,index) in menusForAll" :key="menu.icon" link :to="menu.to" style="text-decoration: none">
            <v-list-item-icon><v-icon>{{menu.icon}}</v-icon></v-list-item-icon>
            <v-list-item-content><v-list-item-title>{{menu.text}}</v-list-item-title></v-list-item-content>
          </v-list-item>
          <v-list-item v-if="getDesignation===3" v-for="(menu,index) in menusForSuperAdmin" :key="menu.icon" link :to="menu.to" style="text-decoration: none">
            <v-list-item-icon><v-icon>{{menu.icon}}</v-icon></v-list-item-icon>
            <v-list-item-content><v-list-item-title>{{menu.text}}</v-list-item-title></v-list-item-content>
          </v-list-item>
        </v-list-item-group>
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

import {mapActions, mapGetters} from 'vuex';
import {isNative} from '../plugins/android_support';
import {isGuestEnabled} from "../api";
import Dialog from "./Dialog";

export default {
  components: {Dialog},
  data: function (){
    return{
      drawer: !this.$isMobile(),
      signOutModalFlag: false,
      signOutAllModalFlag: false,
      menusForAll: [
        {icon: "mdi-home", text: "Home", to: "/home"},
        {icon: "mdi-plus", text: "Donor Creation", to: "/singleDonorCreation"},
        {icon: "mdi-account-group",text:"Members", to: "/members"},
        {icon: "mdi-account", text: "My Profile", to: "/myProfile"},
        {icon: "mdi-hand-heart", text: "Credits", to: "/credits"},
        {icon: "mdi-information",text:"About",to:"/about"}
      ],
      menusForSuperAdmin: [
        {icon: "mdi-chart-bar", text: "Statistics", to: "/statistics/logsByDate"},
        {icon: "mdi-developer-board", text: "Dev Console", to: "/devconsole"},
      ]
    }
  },
  computed: {
    ...mapGetters(['getLoadingFlag', 'getName', 'getDesignation', 'getID', 'getToken']),
    isNative() {
      return isNative();
    },
    isGuestEnabled() {
      return isGuestEnabled();
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions('notification', ['notifySuccess']),
    ...mapActions(['logout', 'logoutAll', 'requestRedirectionToken']),
    async myProfileclicked() {
      await this.$router.push({path: '/home/details', query: {id: this.getID}});
    },
    async signOutModalPrompted(){
      this.signOutModalFlag = true;
    },
    async signOutModalCanceled(){
      this.signOutModalFlag = false;
    },
    async signOutModalConfirmed(){
      this.signOutModalFlag  = false;
      await this.logout();
      await this.$router.push('/');
    },
    async signOutAllModalPrompted(){
      this.signOutAllModalFlag = true;
    },
    async signOutAllModalCanceled(){
      this.signOutAllModalFlag = false;
    },
    async signOutAllModalConfirmed(){
      this.signOutAllModalFlag  = false;
      await this.logoutAll();
      await this.$router.push('/');
    },
    async goToWebClicked() {
      let redirectionToken = await this.requestRedirectionToken();
      let routeData;
      routeData = this.$router.resolve({
        name: 'Redirection',
        query: {token: redirectionToken, payload: this.$route.fullPath}
      });
      window.open(process.env.VUE_APP_FRONTEND_BASE + routeData.href, '_blank');
    }
  },
  watch: {
    group() {
      this.drawer = false
    },
  },
}
</script>

<template>
  <v-app id="app" app>
    <app-bar v-if="getIsLoggedIn"></app-bar>
    <v-main>
      <transition name="slide-fade" mode="out-in">
        <router-view app class="container"></router-view>
      </transition>
    </v-main>
    <transition name="slide-fade">
      <SignInDialog v-if="getSignInLoaderFlag"></SignInDialog>
    </transition>
    <Notification></Notification>

  </v-app>
</template>

<script>
import AppBar from "@/components/AppBar";

import PageTitle from "./components/PageTitle";

import Notification from "./components/Notification";
import {mapActions, mapGetters} from "vuex";
import SignInDialog from "./components/SignInDialog";

import {getDeviceInfo, isNative, exitApp} from '@/plugins/android_support';

export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      waitingForExitConfirmation: false,
    }
  },
  components: {
    PageTitle,
    'app-bar': AppBar,
    Notification,
    SignInDialog
  },
  computed: {
    ...mapGetters(['getSignInLoaderFlag', 'getIsLoggedIn']),
  },
  methods: {
    ...mapActions('release', ['fetchtAppDetails']),
    androidBackButtonHandler() {
      if (this.$route.name === "Details") {
        this.$router.push('/home');
        return;
      }
      if (this.$route.path === "/home" || this.$route.path === '/') {
        if (this.waitingForExitConfirmation === true) {
          return;
        }
        this.waitingForExitConfirmation = true;
        this.$bvModal.msgBoxConfirm('Exit app?', {
          centered: true
        })
            .then(value => {
              if (value === true) {
                exitApp();
              } else {
                this.waitingForExitConfirmation = false;

              }
            })
            .catch(err => {
              // An error occurred
            }).finally(() => {
        })
      } else {
        this.$router.go(-1);
      }
    },
    async versionCheck() {
      const info = await getDeviceInfo();
      const deployedAppInfo = await this.fetchtAppDetails();

      if (isNative() && deployedAppInfo.data.version != info.appVersion) {
        try {
          let value = await this.$bvModal.msgBoxConfirm('New version ' + deployedAppInfo.data.version + ' available. Please download the latest update.', {
            centered: true
          });
          if (value) {
            window.open("https://play.google.com/store/apps/details?id=com.mmmbadhan");
          }
        } catch (e) {}
      }
    },
    // networkEnabled(){
    //   console.log("Network on")
    // },
    // networkDisabled(){
    //   console.log("Network off")
    // },
  },

  async mounted() {
    document.addEventListener("backbutton", this.androidBackButtonHandler, false);
    // window.addEventListener('online', this.networkEnabled);
    // window.addEventListener('offline', this.networkDisabled);
    // console.log(window.navigator.onLine);
    this.versionCheck();
  },

  beforeDestroy() {
    document.removeEventListener("backbutton", this.androidBackButtonHandler);
    // window.removeEventListener('online', this.networkEnabled);
    // window.removeEventListener('offline', this.networkDisabled);
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.required label::after {
  content: " *";
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .3s ease;
}

.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */
{
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-down-enter-active {
  transition: all .3s ease;
}

.slide-fade-down-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-down-enter, .slide-fade-down-leave-to {
  transform: translateY(-40px);
  opacity: 0;
}

.fade-enter-active {
  transition: all .3s ease;
}

.fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-snapout-enter-active {
  transition: all .3s ease;
}

.fade-snapout-enter {
  opacity: 0;
}

.slide-fade-down-snapout-enter-active {
  transition: all .3s ease;
}

.slide-fade-down-snapout-enter {
  transform: translateY(-40px);
  opacity: 0;
}


</style>

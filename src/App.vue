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
    <MessageBox></MessageBox>

    <Dialog
        :message="'Exit App?'"
        :canceled="exitAppCanceled"
        :confirmed="exitAppConfirmed"
        :dialog-opened="exitPromptFlag">
    </Dialog>
    <Dialog
        :message="'New version ' + updatedVersion+ ' available. Please download the latest update.'"
        :canceled="updateCanceled"
        :confirmed="updateConfirmed"
        :dialog-opened="updatePromptFlag">
    </Dialog>

  </v-app>
</template>

<script>
import AppBar from './components/AppBar'

import Notification from './components/Notification'
import { mapActions, mapGetters } from 'vuex'
import SignInDialog from './components/SignInDialog'

import { getDeviceInfo, isNative, exitApp } from './plugins/android_support'
import Dialog from './components/Dialog'
import MessageBox from './components/MessageBox'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      waitingForExitConfirmation: false,

      exitPromptFlag: false,
      updatePromptFlag: false,
      updatedVersion: ''
    }
  },
  components: {
    MessageBox,
    Dialog,
    'app-bar': AppBar,
    Notification,
    SignInDialog
  },
  computed: {
    ...mapGetters(['getSignInLoaderFlag', 'getIsLoggedIn']),
    ...mapGetters('frontendSettings', ['getSettings'])
  },
  methods: {
    ...mapActions('release', ['fetchtAppDetails']),
    ...mapActions('frontendSettings', ['fetchSettings']),

    exitAppPrompt () {
      this.exitPromptFlag = true
    },
    exitAppConfirmed () {
      this.exitPromptFlag = false
      exitApp()
    },
    exitAppCanceled () {
      this.exitPromptFlag = false
    },
    updatePrompt () {
      this.updatePromptFlag = true
    },
    updateConfirmed () {
      this.updatePromptFlag = false
      window.open('https://play.google.com/store/apps/details?id=com.mmmbadhan')
    },
    updateCanceled () {
      this.updatePromptFlag = false
    },

    androidBackButtonHandler () {
      if (this.$route.path === '/home' || this.$route.path === '/') {
        this.exitAppPrompt()
      } else {
        this.$router.go(-1)
      }
    },
    async versionCheck () {
      await this.fetchSettings()
      const googlePlayAppVersion = this.getSettings.version

      const info = await getDeviceInfo()
      // const deployedAppInfo = await this.fetchtAppDetails();

      if (isNative() && googlePlayAppVersion !== info.appVersion) {
        this.updatedVersion = googlePlayAppVersion
        this.updatePrompt()
      }
    }
  },

  async mounted () {
    document.addEventListener('backbutton', this.androidBackButtonHandler, false)
    this.versionCheck()
  },

  beforeDestroy () {
    document.removeEventListener('backbutton', this.androidBackButtonHandler)
  }
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

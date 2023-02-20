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
    <ConfirmationBox></ConfirmationBox>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar'

import Notification from './components/Notification'
import { mapActions, mapGetters } from 'vuex'
import SignInDialog from './components/SignInDialog'
import MessageBox from './components/MessageBox'
import ConfirmationBox from './components/ConfirmationBox'

export default {
  name: 'app',
  data () {
    return {
    }
  },
  components: {
    ConfirmationBox,
    MessageBox,
    'app-bar': AppBar,
    Notification,
    SignInDialog
  },
  computed: {
    ...mapGetters(['getSignInLoaderFlag', 'getIsLoggedIn']),
  },
  methods: {
    ...mapActions('frontendSettings', ['fetchSettings']),
    ...mapActions('githubRelease', ['fetchGithubRelease']),

    async versionCheck () {
      await this.fetchSettings()
      await this.fetchGithubRelease()
    }
  },

  async mounted () {
    await this.versionCheck()
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

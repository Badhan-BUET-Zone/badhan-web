<template>
  <v-app id="app" app>
    <TopProgressBar/>
    <app-bar v-if="getToken"></app-bar>
    <v-main>
      <transition name="slide-fade" mode="out-in">
        <router-view app class="container"></router-view>
      </transition>
    </v-main>
    <Notification/>
    <MessageBox/>
    <ConfirmationBox/>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar'

import Notification from './components/Notification'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import MessageBox from './components/MessageBox'
import ConfirmationBox from './components/ConfirmationBox'
import TopProgressBar from '@/components/TopProgressBar.vue'

export default {
  name: 'app',
  data () {
    return {
    }
  },
  components: {
    TopProgressBar,
    ConfirmationBox,
    MessageBox,
    'app-bar': AppBar,
    Notification,
  },
  computed: {
    ...mapGetters(['getSignInLoaderFlag', 'getIsLoggedIn', 'getToken']),
  },
  methods: {
    ...mapActions('frontendSettings', ['fetchSettings']),
    ...mapMutations(['loadTokenFromLocalStorage','loadMyProfileFromLocalStorage']),
    ...mapActions(['autoLogin']),
    async versionCheck () {
      await this.fetchSettings()
    }
  },

  async mounted () {
    if(this.getToken && !await this.autoLogin()){
      await this.$router.push('/')
    }
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

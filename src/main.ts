import Vue from 'vue'
import App from './App.vue'

// to keep session information in vuex that are not required to be kept even after a reload
import { store } from './store/store'

// router for handling routing in vuejs
import router from './router'

import './registerServiceWorker'

import './mixins/environment'

// bootstrap, a well known UI component library along with it's vue.js compatible bootstrap-vue library
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// library to validate form input in vuejs
import Vuelidate from 'vuelidate'

// library to enable copying to clipboard functionalities
import VueClipboard from 'vue-clipboard2'

// mixin functions to be used across the whole vue.js app
import Mixins from './mixins/index'

// the main UI component library used in this project
import vuetify from './plugins/vuetify'

// filter functions used in <template> tags all across this vue.js project
import './mixins/filters'

// to use rootless components
import Fragment from 'vue-fragment'

Vue.use(Fragment.Plugin)
Vue.use(VueClipboard)
Vue.use(Vuelidate)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.mixin(Mixins)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

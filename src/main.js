import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from "./store/store";

//Bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

// import 'aos/dist/aos.css'

import Mixins from '@/mixins/index'
Vue.mixin(Mixins);

//previous badhan project
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;
export const eventBus = new Vue();


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

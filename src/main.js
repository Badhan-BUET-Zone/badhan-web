import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {store} from "./store/store";

//Bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

import Mixins from '@/mixins/index'
Vue.mixin(Mixins);

//previous badhan project
import axios from 'axios';
import vuetify from './plugins/vuetify';

axios.defaults.baseURL='https://badhan-backend.herokuapp.com';

Vue.config.productionTip = false;
export const eventBus = new Vue();


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

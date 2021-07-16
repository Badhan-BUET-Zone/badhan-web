import Vue from 'vue'
import App from './App.vue'

import router from './router'
import {store} from "./store/store";

//Bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuelidate from 'vuelidate'
import VueClipboard from 'vue-clipboard2'
import Mixins from '@/mixins/index';
import vuetify from './plugins/vuetify';

Vue.use(VueClipboard);
Vue.use(Vuelidate)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.errorHandler = (err, vm, info) => {
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
  console.log(err);
  store.commit('errorStore/addError',err);
};

Vue.mixin(Mixins);

Vue.config.productionTip = false;
export const eventBus = new Vue();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

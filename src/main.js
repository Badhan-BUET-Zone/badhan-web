import Vue from 'vue'
import App from './App.vue'

import router from './router'
import {store} from "./store/store";
// import AOS from 'aos'
// import 'aos/dist/aos.css'

//Bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuelidate from 'vuelidate'
import VueClipboard from 'vue-clipboard2'
import Mixins from '@/mixins/index';
import vuetify from './plugins/vuetify';

import filters from "./mixins/filters";

Vue.use(VueClipboard);
Vue.use(Vuelidate)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.filter('getHallName',filters.getHallName);

Vue.config.errorHandler = (err, vm, info) => {
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
  console.log(err);
  store.commit('errorStore/addError',err);
};

Vue.config.warnHandler =  (err, vm, info)=>{
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  console.log(err);
  store.commit('errorStore/addError', {name: "Warning",message: err,stack:info});
};

Vue.mixin(Mixins);

Vue.config.productionTip = false;
export const eventBus = new Vue();

new Vue({
  // created () {
  //   AOS.init()
  // },
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

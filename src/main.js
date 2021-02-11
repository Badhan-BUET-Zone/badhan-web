import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//Bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

//previous badhan project
import axios from 'axios';
import VueAxios from 'vue-axios';
import Storage from 'vue-web-storage';

axios.defaults.baseURL='https://badhan-backend-new.herokuapp.com';
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
export const eventBus = new Vue();


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

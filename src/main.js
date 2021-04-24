import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./firebase";

import BootstrapVue from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

import VueCodemirror from 'vue-codemirror'
// require styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/pascal/pascal.js';
 
// require more codemirror resource...
 
// you can set default global options and events when use
Vue.use(VueCodemirror, /* { 
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */)

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;

/* Variables globales */
Vue.prototype.$lenguajes = []
Vue.prototype.$parametros = []

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

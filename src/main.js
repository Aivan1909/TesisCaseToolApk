import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyDKRKgkpOYnu6C5x8-FbIpSY2_rIW0ecng",
  authDomain: "tesiscase.firebaseapp.com",
  projectId: "tesiscase",
  storageBucket: "tesiscase.appspot.com",
  messagingSenderId: "845140039633",
  appId: "1:845140039633:web:cc7d2249d41b24cf1fb2f0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


import BootstrapVue from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

import VueCodemirror from 'vue-codemirror'
// require styles
import 'codemirror/lib/codemirror.css'
 
// require more codemirror resource...
 
// you can set default global options and events when use
Vue.use(VueCodemirror, /* { 
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */)

Vue.config.productionTip = false;

/* Variables globales */
Vue.prototype.$lenguajes = []
Vue.prototype.$parametros = []

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");

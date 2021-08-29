import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'

Vue.config.productionTip = false

if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost'
  axios.defaults.withCredentials = true
}

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

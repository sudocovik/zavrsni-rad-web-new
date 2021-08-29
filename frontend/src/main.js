import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from 'axios'

Vue.config.productionTip = false

process.env.NODE_ENV === 'development' && (axios.defaults.baseURL = 'http://localhost')

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')

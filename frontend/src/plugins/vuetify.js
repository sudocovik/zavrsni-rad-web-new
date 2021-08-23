import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import hr from 'vuetify/lib/locale/hr'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { hr },
    current: 'hr'
  }
})

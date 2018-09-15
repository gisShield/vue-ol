import Vue from 'vue'
import VueOpenlayer from './components/vue-openlayers'

Vue.use(VueOpenlayer)
new Vue({
  el: '#app',
  render: h => h(App)
})

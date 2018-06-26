import Vue from 'vue'
import App from './App.vue'
var VueFire = require('vuefire')
var firebase = require('firebase')

Vue.use(VueFire)

new Vue({
  el: '#app',
  render: h => h(App)
})

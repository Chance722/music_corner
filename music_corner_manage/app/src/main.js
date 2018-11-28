// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()
import mint from 'mint-ui'
import axios from 'axios'
import 'mint-ui/lib/style.css'
import './assets/css/base.scss'
import './assets/css/override.scss'

Vue.use(mint)

Vue.config.devtools = true
Vue.config.productionTip = false

Vue.prototype.$eventhub = new Vue({})

Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})

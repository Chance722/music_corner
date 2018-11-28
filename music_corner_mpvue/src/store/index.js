import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'

// 在控制台打印日志
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)
const isDev = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  actions,
  mutations,
  strict: isDev,
  plugins: isDev ? [createLogger()] : []
})

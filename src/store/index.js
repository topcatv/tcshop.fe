import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
  isLoading: false,
  isLogin: false
}

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [createPersistedState({paths: ['isLogin']})]
})

export default store

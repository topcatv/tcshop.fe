import axios from 'axios'
import router from '../router'
import {
  SHOW_LOADING,
  LOGIN
} from './mutation-types.js'

/* 异步操作 */
export default {
  login({commit, state}, user) {
    commit(SHOW_LOADING, true)
    setTimeout(function() {
      commit(LOGIN, true)
      commit(SHOW_LOADING, false)
      router.push('Main')
    }, 2000)
  }
}

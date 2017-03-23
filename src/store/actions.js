import axios from 'axios'
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
    }, 2000)
  }
}

import axios from 'axios'
import router from '../router'
import qs from 'qs'
import {
  SHOW_LOADING,
  LOGIN
} from './mutation-types.js'

axios.defaults.baseURL = 'api'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'

/* 异步操作 */
export default {
  login({commit, state}, user) {
    commit(SHOW_LOADING, true)
    axios.post('login', qs.stringify(user))
      .then(response => {
        let data = response.data
        commit(SHOW_LOADING, false)
        if (data && data.success) {
          commit(LOGIN, {bool: true})
          router.push('Main')
        } else {
          commit(LOGIN, {bool: false, message: data.message})
        }
      })
      .catch(error => {
        console.log(error)
        commit(SHOW_LOADING, false)
      })
  }
}

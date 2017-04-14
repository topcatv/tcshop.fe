import {
  SHOW_LOADING,
  LOGIN
} from './mutation-types'

export default {
  [SHOW_LOADING](state, bool) {
    state.isLoading = bool
  },
  [LOGIN](state, {bool, message}) {
    state.isLogin = bool
    if (!bool) {
      state.warn = message
    }
  }
}

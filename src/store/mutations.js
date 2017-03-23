import {
  SHOW_LOADING,
  LOGIN
} from './mutation-types'

export default {
  [SHOW_LOADING](state, bool) {
    state.isLoading = bool
  },
  [LOGIN](state, bool) {
    state.isLogin = bool
  }
}

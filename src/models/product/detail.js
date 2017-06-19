import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { get, create, update } from '../../services/product'

export default {

  namespace: 'productDetail',

  state: {
    item: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        let match = pathToRegexp('/product/:id').exec(location.pathname)
        if (match) {
          let type = 'query'
          if (match[1] === 'create') {
            type = 'preparForCreate'
          }
          dispatch({ type, payload: { id: match[1] } })
        }
        match = pathToRegexp('/product/edit/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
      })
    },
  },

  effects: {
    *query ({
      payload,
    }, { call, put }) {
      const data = yield call(get, payload)
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            item: other.data,
          },
        })
      } else {
        throw data
      }
    },
    *preparForCreate ({
      payload,
    }, { call, put }) {
      yield put({
        type: 'clearItem',
        payload: {},
      })
    },
    *create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put(routerRedux.goBack())
      } else {
        throw data
      }
    },
    *update ({ payload }, { select, call, put }) {
      const id = yield select(({ productDetail }) => productDetail.item.id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      if (data.success) {
        yield put(routerRedux.goBack())
      } else {
        throw data
      }
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { item } = payload
      return {
        ...state,
        item,
      }
    },
    clearItem (state, { payload }) {
      return {
        ...state,
        item: {},
      }
    },
  },
}

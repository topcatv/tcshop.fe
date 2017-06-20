import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { get, create, update, getUpToken } from '../../services/brand'

export default {

  namespace: 'brandDetail',

  state: {
    item: {},
    upload: {
      files: [],
      token: '',
      key: '',
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        let match = pathToRegexp('/brand/:id').exec(location.pathname)
        if (match) {
          let type = 'query'
          if (match[1] === 'create') {
            type = 'preparForCreate'
          }
          dispatch({ type, payload: { id: match[1] } })
        }
        match = pathToRegexp('/brand/edit/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })
        }
        dispatch({ type: 'getUpToken', payload: { ns: 'brand' } })
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
      const id = yield select(({ brandDetail }) => brandDetail.item.id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      if (data.success) {
        yield put(routerRedux.goBack())
      } else {
        throw data
      }
    },
    *getUpToken ({ payload }, { call, put }) {
      const data = yield call(getUpToken, payload)
      if (data.success) {
        yield put({
          type: 'setUpToken',
          payload: {
            token: data.data,
            key: data.uploadKey,
          },
        })
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
    setUpToken (state, { payload }) {
      return {
        ...state,
        upload: payload,
      }
    },
    logoShow (state) {
      return {
        ...state,
        item: {
          ...state.item,
          logo: state.upload.key,
        },
      }
    },
  },
}

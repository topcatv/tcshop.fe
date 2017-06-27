import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { get, create, update } from '../../services/product'
import { getUpToken } from '../../services/app'
import _ from 'lodash'

export default {

  namespace: 'productDetail',

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
        dispatch({ type: 'getUpToken', payload: { ns: 'product' } })
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
        console.log(other.data)
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
    }, { put }) {
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
    *picShow ({ payload }, { call, put }) {
      const data = yield call(getUpToken, payload)
      if (data.success) {
        yield put({
          type: 'setPics',
          payload: {},
        })
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
      console.log(payload)
      return {
        ...state,
        item: payload.item,
      }
    },
    clearItem (state) {
      return {
        ...state,
        item: {},
      }
    },
    removePic (state, { picKey }) {
      let pics = _.split(state.item.pics, ',')
      pics = _.remove(pics, (pic) => {
        return pic === picKey
      })
      return {
        ...state,
        item: {
          ...state.item,
          pics: _.join(pics, ','),
        },
      }
    },
    setUpToken (state, { payload }) {
      return {
        ...state,
        upload: payload,
      }
    },
    setPics (state) {
      const pics = state.item.pics ? `${state.item.pics},${state.upload.key}` : state.upload.key
      return {
        ...state,
        item: {
          ...state.item,
          pics,
        },
      }
    },
  },
}

import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { get, create, getAllPermission } from '../../services/role'

export default {

  namespace: 'roleDetail',

  state: {
    item: {},
    allPermission: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        let match = pathToRegexp('/role/:id').exec(location.pathname)
        if (match) {
          let type = 'query'
          if (match[1] === 'edit') {
            type = 'loadAllPermission'
          }
          dispatch({ type, payload: { id: match[1] } })
        }
        match = pathToRegexp('/role/edit/:id').exec(location.pathname)
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
      const permissionsData = yield call(getAllPermission)
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'querySuccess',
          payload: {
            item: other.data,
            allPermission: permissionsData.data,
          },
        })
      } else {
        throw data
      }
    },
    *loadAllPermission ({
      payload,
    }, { call, put }) {
      const data = yield call(getAllPermission)
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'allPermission',
          payload: {
            allPermission: other.data,
          },
        })
      } else {
        throw data
      }
    },
    *create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put(routerRedux.goBack())
      } else {
        throw data
      }
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      const { item, allPermission } = payload
      return {
        ...state,
        item,
        allPermission,
      }
    },
    allPermission (state, { payload }) {
      const { allPermission } = payload
      return {
        ...state,
        allPermission,
      }
    },
  },
}

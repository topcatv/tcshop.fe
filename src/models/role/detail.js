import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { get, create, update, queryPermissions } from '../../services/role'

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
          if (match[1] === 'create') {
            type = 'preparForCreate'
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
      const permissionsData = yield call(queryPermissions)
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
    *preparForCreate ({
      payload,
    }, { call, put }) {
      const data = yield call(queryPermissions)
      const { success, message, status, ...other } = data
      if (success) {
        yield put({
          type: 'allPermissionAndClearItem',
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
    *update ({ payload }, { select, call, put }) {
      console.log(payload)
      const id = yield select(({ roleDetail }) => roleDetail.item.id)
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
      const { item, allPermission } = payload
      return {
        ...state,
        item,
        allPermission,
      }
    },
    allPermissionAndClearItem (state, { payload }) {
      const { allPermission } = payload
      return {
        ...state,
        item: {},
        allPermission,
      }
    },
  },
}

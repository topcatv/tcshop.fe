import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { get, create, update, queryCategoryTree } from '../../services/category'

export default {

  namespace: 'categoryDetail',

  state: {
    item: {},
    allCategory: [],
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(() => {
        let match = pathToRegexp('/category/:id').exec(location.pathname)
        if (match) {
          let type = 'query'
          if (match[1] === 'create') {
            type = 'preparForCreate'
          }
          dispatch({ type, payload: { id: match[1] } })
        }
        match = pathToRegexp('/category/edit/:id').exec(location.pathname)
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
      const treeData = yield call(queryCategoryTree)
      if (treeData.success) {
        yield put({
          type: 'allCategoryAndClearItem',
          payload: {
            allCategory: treeData.data,
          },
        })
      } else {
        throw treeData
      }
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
      const data = yield call(queryCategoryTree)
      if (data.success) {
        yield put({
          type: 'allCategoryAndClearItem',
          payload: {
            allCategory: data.data,
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
      const id = yield select(({ categoryDetail }) => categoryDetail.item.id)
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
    allCategoryAndClearItem (state, { payload }) {
      const { allCategory } = payload
      return {
        ...state,
        item: {},
        allCategory,
      }
    },
  },
}

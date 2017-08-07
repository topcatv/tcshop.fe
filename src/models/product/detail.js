import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { get, create, update, queryBrands, queryCategories } from '../../services/product'
import _ from 'lodash'

export default {

  namespace: 'productDetail',

  state: {
    item: {},
    brands: [],
    categories: [],
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
      })
    },
  },

  effects: {
    *query ({
      payload,
    }, { call, put }) {
      let data = yield call(queryBrands)
      if (data.success) {
        yield put({
          type: 'brandsAndClearItem',
          payload: {
            brands: data.data,
          },
        })
      } else {
        throw data
      }
      data = yield call(queryCategories)
      if (data.success) {
        yield put({
          type: 'categoriesAndClearItem',
          payload: {
            categories: data.data,
          },
        })
      } else {
        throw data
      }
      data = yield call(get, payload)
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
      let data = yield call(queryBrands)
      if (data.success) {
        yield put({
          type: 'brandsAndClearItem',
          payload: {
            brands: data.data,
          },
        })
      } else {
        throw data
      }
      data = yield call(queryCategories)
      if (data.success) {
        yield put({
          type: 'categoriesAndClearItem',
          payload: {
            categories: data.data,
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
    brandsAndClearItem (state, { payload }) {
      const { brands } = payload
      return {
        ...state,
        item: {},
        brands,
      }
    },
    categoriesAndClearItem (state, { payload }) {
      const { categories } = payload
      return {
        ...state,
        item: {},
        categories,
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
  },
}

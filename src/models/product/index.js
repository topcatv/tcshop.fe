import { query, create, remove, update } from '../../services/product'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { message } from 'antd'

export default {

  namespace: 'product',

  state: {
    list: [],
    currentItem: {},
    modalType: 'create',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/product') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {
    *requery ({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: location.pathname,
        query: parse(location.search.substr(1)),
      }))
    },
    *query ({ payload }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }
    },
    *'delete' ({ payload }, { call, put }) {
      const data = yield call(remove, { id: payload })
      if (data.success) {
        message.success('删除成功.')
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    *create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
    *update ({ payload }, { select, call, put }) {
      console.log(payload)
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      if (data.success) {
        yield put({ type: 'requery' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return { ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },
  },

}
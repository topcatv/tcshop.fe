import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'

const Custormer = ({ location, dispatch, custormer, loading }) => {
  const { list, pagination } = custormer
  const { pageSize } = pagination

  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/custormer',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/custormer',
      }))
    },
    onAdd () {
      dispatch(routerRedux.push({
        pathname: '/custormer/create',
      }))
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['custormer/query'],
    pagination,
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'custormer/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch(routerRedux.push(`custormer/edit/${item.id}`))
    },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

Custormer.propTypes = {
  custormer: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ custormer, loading }) => ({ custormer, loading }))(Custormer)


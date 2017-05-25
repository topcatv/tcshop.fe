import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'

const Brand = ({ location, dispatch, brand, loading }) => {
  const { list, pagination } = brand
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
        pathname: '/brand',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/brand',
      }))
    },
    onAdd () {
      dispatch(routerRedux.push({
        pathname: '/brand/create',
      }))
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['brand/query'],
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
        type: 'brand/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch(routerRedux.push(`brand/edit/${item.id}`))
    },
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

Brand.propTypes = {
  brand: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ brand, loading }) => ({ brand, loading }))(Brand)

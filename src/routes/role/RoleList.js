import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from '../../components'
import { Link } from 'dva/router'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import classnames from 'classnames'
import styles from './List.less'

const confirm = Modal.confirm

function list ({ onDeleteItem, onEditItem, location, ...tableProps }) {
  const handleMenuClick = (record, e) => {
    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '确定要删除吗?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }
  }

  const columns = [
    {
      title: '角色名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`role/${record.id}`}>{text}</Link>,
    }, {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (text, record) => {
        if (record.permissions) {
          record.permissions.forEach((p) => {
            return <span>{p}</span>
          })
        }
      },
    }, {
      title: '操作',
      key: 'id',
      width: 100,
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
      },
    },
  ]

  const getBodyWrapperProps = {
    page: location.query.page,
    current: tableProps.pagination.current,
  }

  const getBodyWrapper = body => { return <AnimTableBody {...getBodyWrapperProps} body={body} /> }

  return (
    <div>
      <Table
        {...tableProps}
        columns={columns}
        className={classnames({ [styles.table]: true, [styles.motion]: true })}
        simple
        rowKey={record => record.id}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

list.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default list

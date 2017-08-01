import React from 'react'
import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import { DropOption } from '../../components'
import { Link } from 'dva/router'
import AnimTableBody from '../../components/DataTable/AnimTableBody'
import classnames from 'classnames'
import styles from './List.less'
import { QINIU_IMG_HOST } from '../../utils/config'
import _ from 'lodash'

const confirm = Modal.confirm

function List ({ onDeleteItem, onEditItem, location, ...tableProps }) {
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
      title: '图片',
      dataIndex: 'pics',
      key: 'pics',
      render: (text) => <img src={`${QINIU_IMG_HOST}/${_.split(text, ',')[0]}?imageView2/1/w/48/h/48/format/jpg/q/70|imageslim`} alt="图片" />,
    },
    {
      title: '商品名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link to={`Product/${record.id}`}>{text}</Link>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => (text === '1' ? '实物商品' : '虚拟商品'),
    },
    {
      title: '商品编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '商品标签',
      dataIndex: 'tags',
      key: 'tags',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '运费',
      dataIndex: 'freightage',
      key: 'freightage',
    },
    {
      title: '操作',
      key: 'op',
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
        className={classnames({ [styles.table]: true, [styles.motion]: true })}
        columns={columns}
        simple
        rowKey={record => record.id}
        getBodyWrapper={getBodyWrapper}
      />
    </div>
  )
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List

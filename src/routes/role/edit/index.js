import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Form, Input, Row, Col, Button, Modal, Transfer } from 'antd'

const FormItem = Form.Item
const confirm = Modal.confirm

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const RoleEdit = ({
  roleDetail,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const { item, allPermission } = roleDetail

  const permissions = allPermission.map((e) => {
    return { key: `${e.id}`, title: e.permission, description: e.permission, disable: false }
  })

  function handleOk () {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        id: item.id,
      }
      console.log(data)
      if (data.id) {
        dispatch({
          type: 'roleDetail/update',
          payload: {
            ...data,
          },
        })
      } else {
        dispatch({
          type: 'roleDetail/create',
          payload: {
            ...data,
          },
        })
      }
    })
  }

  function handleCancel () {
    confirm({
      title: '还没有保存确定返回吗?',
      onOk () {
        dispatch(routerRedux.goBack())
      },
    })
  }

  return (
    <div className="content-inner">
      <Form layout="horizontal">
        <FormItem label="角色名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: '请输入角色名',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="权限" {...formItemLayout}>
          {getFieldDecorator('permissions', {
            initialValue: item.permissions,
            valuePropName: 'targetKeys',
            rules: [
              {
                required: true,
                message: '请选择权限',
              },
            ],
          })(
            <Transfer
              titles={['待选', '已选']}
              dataSource={permissions}
              render={p => p.title}
              notFoundContent={'暂无数据'}
            />
          )}
        </FormItem>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={handleOk}>提交</Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>返回</Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

RoleEdit.propTypes = {
  form: PropTypes.object.isRequired,
  roleDetail: PropTypes.object,
  dispatch: PropTypes.func,
}
const RoleEditForm = Form.create()(RoleEdit)

export default connect(({ roleDetail }) => ({ roleDetail }))(RoleEditForm)

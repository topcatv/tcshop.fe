import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { QINIU_IMG_HOST } from '../../../utils/config'
import { Form, Input, Row, Col, Button, Modal } from 'antd'

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

let confirmDirty = false

const Edit = ({
  custormerDetail,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
}) => {
  const { item } = custormerDetail
  function handleOk () {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        id: item.id,
      }
      if (data.id) {
        dispatch({
          type: 'custormerDetail/update',
          payload: {
            ...data,
          },
        })
      } else {
        dispatch({
          type: 'custormerDetail/create',
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

  const handleConfirmBlur = (e) => {
    const value = e.target.value
    confirmDirty = confirmDirty || !!value
  }

  const checkPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('password')) {
      callback('两次输入的密码不一致')
    } else {
      callback()
    }
  }
  const checkConfirm = (rule, value, callback) => {
    if (value && confirmDirty) {
      validateFields(['confirm'], { force: true })
    }
    callback()
  }

  const passwordRequire = (isRequire) => {
    let rule = [{
      required: true,
      message: '请输入密码',
    }, {
      validator: checkConfirm,
    }]
    return isRequire ? rule : []
  }

  const confirmRequire = (isRequire) => {
    let rule = [{
      required: true,
      message: '请输入确认密码',
    }, {
      validator: checkPassword,
    }]
    return isRequire ? rule : []
  }

  return (
    <div className="content-inner">
      <Form layout="horizontal">
        <FormItem label="">
            {getFieldDecorator('id', {
              initialValue: item.id,
            })(<Input type="hidden" />)}
        </FormItem>
        <FormItem label="微信号" hasFeedback {...formItemLayout}>
            {getFieldDecorator('weixin', {
              initialValue: item.weixin,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="客户名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('userName', {
              initialValue: item.userName,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="移动电话" hasFeedback {...formItemLayout}>
            {getFieldDecorator('mobile', {
              initialValue: item.mobile,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: passwordRequire(!item.id),
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem label="确认密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('confirm', {
            rules: confirmRequire(item.id),
          })(
            <Input type="password" onBlur={handleConfirmBlur} />
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

Edit.propTypes = {
  form: PropTypes.object.isRequired,
  productDetail: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ custormerDetail }) => ({ custormerDetail }))(Form.create()(Edit))

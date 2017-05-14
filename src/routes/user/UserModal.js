import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
let confirmDirty = false

const modal = ({
  visible,
  type,
  item = {},
  onOk,
  onCancel,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
}) => {
  function handleOk () {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      onOk(data)
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

  const modalOpts = {
    title: `${type === 'create' ? '新建用户' : '更新用户'}`,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
  }

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="用户名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('userName', {
            initialValue: item.userName,
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="用户账号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('loginName', {
            initialValue: item.loginName,
            rules: [
              {
                required: true,
                message: '请输入用户账号',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              }, {
                validator: checkConfirm,
              },
            ],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem label="确认密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
                message: '请输入确认密码',
              }, {
                validator: checkPassword,
              },
            ],
          })(
            <Input type="password" onBlur={handleConfirmBlur} />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  visible: PropTypes.bool,
  type: PropTypes.string,
  item: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
}

export default Form.create()(modal)

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
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {
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

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
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
            rules: passwordRequire(modalOpts.title === 'Create User'),
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem label="确认密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('confirm', {
            rules: confirmRequire(modalOpts.title === 'Update User'),
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
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)

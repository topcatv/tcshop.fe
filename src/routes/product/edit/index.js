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

const Edit = ({
  productDetail,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const { item } = productDetail

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
          type: 'productDetail/update',
          payload: {
            ...data,
          },
        })
      } else {
        dispatch({
          type: 'productDetail/create',
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
        <FormItem label="">
            {getFieldDecorator('id', {
              initialValue: item.id,
            })(<Input type="hidden" />)}
        </FormItem>
        <FormItem label="brand_id" hasFeedback {...formItemLayout}>
            {getFieldDecorator('brand_id', {
              initialValue: item.brand_id,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: item.type,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="code" hasFeedback {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: item.code,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="name" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="pics" hasFeedback {...formItemLayout}>
            {getFieldDecorator('pics', {
              initialValue: item.pics,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="tags" hasFeedback {...formItemLayout}>
            {getFieldDecorator('tags', {
              initialValue: item.tags,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('price', {
              initialValue: item.price,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="stock" hasFeedback {...formItemLayout}>
            {getFieldDecorator('stock', {
              initialValue: item.stock,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="description" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="freightage" hasFeedback {...formItemLayout}>
            {getFieldDecorator('freightage', {
              initialValue: item.freightage,
              rules: [],
            })(<Input />)}
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

export default connect(({ productDetail }) => ({ productDetail }))(Form.create()(Edit))

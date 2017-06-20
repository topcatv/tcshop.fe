import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Form, Input, Row, Col, Button, Modal, Radio, InputNumber, Select } from 'antd'

const FormItem = Form.Item
const confirm = Modal.confirm
const RadioGroup = Radio.Group
const Option = Select.Option

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
        <FormItem label="品牌" hasFeedback {...formItemLayout}>
            {getFieldDecorator('brand_id', {
              initialValue: item.brand_id,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="商品类型" hasFeedback {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: item.type,
              rules: [
                {
                  required: true,
                  message: '请选择商品类型',
                },
              ],
            })(
              <RadioGroup>
                <Radio value={1}>实物商品</Radio>
                <Radio value={2}>虚拟商品</Radio>
              </RadioGroup>
            )}
        </FormItem>
        <FormItem label="编码" hasFeedback {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: item.code,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="图片" hasFeedback {...formItemLayout}>
            {getFieldDecorator('pics', {
              initialValue: item.pics,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="标签" hasFeedback {...formItemLayout}>
            {getFieldDecorator('tags', {
              initialValue: item.tags,
              rules: [],
            })(
              <Select
                mode="tags"
                style={{ width: '100%' }}
                searchPlaceholder="标签"
              />
            )}
        </FormItem>
        <FormItem label="价格" hasFeedback {...formItemLayout}>
            {getFieldDecorator('price', {
              initialValue: item.price,
              rules: [],
            })(
              <InputNumber
                min={0}
                precision={2}
              />
            )}
        </FormItem>
        <FormItem label="库存" hasFeedback {...formItemLayout}>
            {getFieldDecorator('stock', {
              initialValue: item.stock,
              rules: [],
            })(
              <InputNumber
                min={0}
                precision={0}
              />
            )}
        </FormItem>
        <FormItem label="描述" hasFeedback {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue: item.description,
              rules: [],
            })(<Input type="textarea" rows={4} />)}
        </FormItem>
        <FormItem label="运费" hasFeedback {...formItemLayout}>
            {getFieldDecorator('freightage', {
              initialValue: item.freightage,
              rules: [],
            })(
              <InputNumber
                min={0}
                precision={2}
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

Edit.propTypes = {
  form: PropTypes.object.isRequired,
  productDetail: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ productDetail }) => ({ productDetail }))(Form.create()(Edit))

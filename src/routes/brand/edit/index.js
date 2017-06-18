import React from 'react'
import Qiniu from 'react-qiniu'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Form, Input, InputNumber, Row, Col, Button, Modal } from 'antd'

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
  brandDetail,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const { item, upload } = brandDetail

  function onDrop (files) {
    console.log(files)
  }

  function onUpload (files) {
    files.map((f) => {
      f.onprogress = function (e) {
        console.log(e.percent)
        if (e.percent >= 100) {
          dispatch({
            type: 'brandDetail/logoShow',
          })
        }
      }
      return f
    })
  }

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
          type: 'brandDetail/update',
          payload: {
            ...data,
          },
        })
      } else {
        dispatch({
          type: 'brandDetail/create',
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
        <FormItem label="品牌名" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="品牌logo" hasFeedback {...formItemLayout}>
            {getFieldDecorator('logo', {
              initialValue: item.logo,
              rules: [],
            })(<Input type="hidden" />)}
          <Qiniu uploadUrl="http://upload-z2.qiniu.com" uploadKey={upload.uploadKey} onDrop={onDrop} size={150} token={upload.token} onUpload={onUpload}>
            {item.logo ? <img src={`http://orop9dwa6.bkt.clouddn.com/${item.logo}`} /> : <div>拖拽文件到此处上传</div>}
          </Qiniu>
        </FormItem>
        <FormItem label="显示位置" hasFeedback {...formItemLayout}>
            {getFieldDecorator('position', {
              initialValue: item.position,
              rules: [],
            })(<InputNumber min={1} step={1} />)}
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
  brandDetail: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ brandDetail }) => ({ brandDetail }))(Form.create()(Edit))

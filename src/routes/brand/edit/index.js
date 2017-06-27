import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { QINIU_IMG_HOST } from '../../../utils/config'
import { connect } from 'dva'
import QiniuPicturesWall from '../../../components/Uploader/QiniuPicturesWall'
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

  let handleChange = (info) => {
    if (info.file.status === 'done') {
      dispatch({
        type: 'brandDetail/logoShow',
      })
    }
  }

  const fileList = []

  if (item.logo) {
    fileList.push({
      uid: item.logo,
      name: `${item.logo}_detail`,
      status: 'done',
      url: `${QINIU_IMG_HOST}/${item.logo}_detail`,
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
          <QiniuPicturesWall
            imageType="image/jpeg"
            uploadLimit={2}
            handleChange={handleChange}
            token={upload.token}
            uploadKey={upload.key}
            fileList={fileList}
            fileCount={1}
          />
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

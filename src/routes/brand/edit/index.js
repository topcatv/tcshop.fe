import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { QINIU_IMG_HOST, baseURL } from '../../../utils/config'
import { connect } from 'dva'
import _ from 'lodash'
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
    setFieldsValue,
  },
}) => {
  const { item } = brandDetail

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

  const fileList = []

  if (item.logo) {
    fileList.push({
      uid: item.logo,
      name: `${item.logo}_detail`,
      status: 'done',
      url: `${QINIU_IMG_HOST}/${item.logo}_detail`,
    })
  }

  const uploadConfig = {
    QINIU_URL: 'http://upload-z2.qiniu.com', // 上传地址，现在暂只支持七牛上传
    QINIU_IMG_TOKEN_URL: `${baseURL}/qiniu/uptoken`, // 请求图片的token
    QINIU_KEY_PREFIX: 'brand',
    QINIU_PFOP: {
      url: 'http://upload-z2.qiniu.com', // 七牛持久保存请求地址
    },
    QINIU_VIDEO_TOKEN_URL: `${baseURL}/qiniu/uptoken`, // 请求媒体资源的token
    QINIU_FILE_TOKEN_URL: `${baseURL}/qiniu/uptoken`, // 其他资源的token的获取
    QINIU_DOMAIN_IMG_URL: `${QINIU_IMG_HOST}`, // 图片文件地址的前缀
    QINIU_DOMAIN_VIDEO_URL: `${QINIU_IMG_HOST}`, // 视频文件地址的前缀
    QINIU_DOMAIN_FILE_URL: `${QINIU_IMG_HOST}`, // 其他文件地址前缀
    handleChange: (info) => {
      setFieldsValue({ logo: '' })
      if (info.file.status === 'done') {
        setFieldsValue({
          logo: info.file.response.key,
        })
      }
    },
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
          {getFieldDecorator('rlogo', {
            initialValue: fileList,
            valuePropName: 'fileList',
            rules: [],
          })(
            <QiniuPicturesWall
              imageType="image/jpeg"
              uploadLimit={2}
              uploadConfig={uploadConfig}
              fileCount={1}
            />
          )}
        </FormItem>
        {getFieldDecorator('logo', {
          initialValue: item.logo,
          rules: [],
        })(<Input type="hidden" />)}
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

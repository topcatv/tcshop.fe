import React from 'react'
// import Qiniu from 'react-qiniu'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { QINIU_IMG_HOST } from '../../../utils/config'
import { connect } from 'dva'
import styles from './index.less'
import { Upload, Icon, Form, Input, InputNumber, Row, Col, Button, Modal, message } from 'antd'

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

  function beforeUpload (file) {
    const isJPG = file.type === 'image/jpeg'
    if (!isJPG) {
      message.error('只能上传JPG图片')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小必须小于2M')
    }
    return isJPG && isLt2M
  }

  let handleChange = (info) => {
    if (info.file.status === 'done') {
      dispatch({
        type: 'brandDetail/logoShow',
      })
    }
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
          <Upload
            className={styles.avatar_uploader}
            name="file"
            showUploadList={false}
            action="http://upload-z2.qiniu.com"
            data={upload}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {
              item.logo ?
                <img src={`${QINIU_IMG_HOST}/${item.logo}_detail`} alt="" className={styles.avatar} /> :
                <Icon type="plus" className={styles.avatar_uploader_trigger} />
            }
          </Upload>
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

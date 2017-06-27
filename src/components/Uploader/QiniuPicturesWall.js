import React from 'react'
import PropTypes from 'prop-types'
import styles from './QiniuPicturesWall.less'
import _ from 'lodash'
import { Upload, Icon, Modal, message } from 'antd'

class QiniuPicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.fileList,
  }

  componentWillReceiveProps = (nextProps) => {
    console.log(nextProps.fileList, this.props.fileList, _.differenceWith(nextProps.fileList, this.props.fileList, (value, other) => { return value.url === other.url }))
    if (_.differenceWith(nextProps.fileList, this.props.fileList, (value, other) => { return value.url === other.url }).length > 0) {
      this.setState({ fileList: nextProps.fileList })
    }
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  beforeUpload = (file) => {
    const isJPG = file.type === this.props.imageType
    if (!isJPG) {
      message.error('只能上传JPG图片')
    }
    const isLt2M = file.size / 1024 / 1024 < this.props.uploadLimit
    if (!isLt2M) {
      message.error('图片大小必须小于2M')
    }
    return isJPG && isLt2M
  }

  renderFileList = (uploadButton) => {
    if (!this.props.fileCount) {
      return uploadButton
    }
    return (this.state.fileList.length >= this.props.fileCount ? null : uploadButton)
  }

  render () {
    const { token, uploadKey, handleChange, handleRemove } = this.props
    const { previewVisible, previewImage } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className={styles['ant-upload-text']}>上传</div>
      </div>
    )
    const uploadProp = {
      name: 'file',
      action: 'http://upload-z2.qiniu.com',
      data: {
        token,
        key: uploadKey,
      },
      beforeUpload: this.beforeUpload,
      onChange: (fl) => {
        handleChange(fl)
        this.setState({ fileList: fl.fileList.slice() })
      },
      onRemove: handleRemove,
    }
    return (
      <div className="clearfix">
        <Upload
          {...uploadProp}
          listType="picture-card"
          fileList={this.state.fileList}
          onPreview={this.handlePreview}
        >
          {this.renderFileList(uploadButton)}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

QiniuPicturesWall.propTypes = {
  uploadLimit: PropTypes.number,
  token: PropTypes.string,
  uploadKey: PropTypes.string,
  imageType: PropTypes.string,
  fileList: PropTypes.array,
  handleChange: PropTypes.func,
  handleRemove: PropTypes.func,
  fileCount: PropTypes.number,
}

export default QiniuPicturesWall

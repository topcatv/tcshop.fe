import React from 'react'
import PropTypes from 'prop-types'
import styles from './QiniuUploader.less'
import QiniuPicturesWall from './QiniuPicturesWall'
import { Upload, Icon, message } from 'antd'

class QiniuUploader extends React.Component {
  state = {}

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

  uploadButton = <Icon type="plus" className={styles.avatar_uploader_trigger} />

  imagesRender = (fileList) => {
    if (fileList && fileList.length >= 1) {
      let image = fileList[0]
      return (image.url ? <img src={image.url} alt={image.name} className={styles.avatar} /> : <Icon type="plus" className={styles.avatar_uploader_trigger} />)
    }
    return this.uploadButton
  }

  render () {
    const { token, uploadKey, handleChange, fileList, uploadType } = this.props
    let uploadProp = {
      className: styles.avatar_uploader,
      name: 'file',
      showUploadList: fileList.length > 1,
      action: 'http://upload-z2.qiniu.com',
      data: {
        token,
        key: uploadKey,
      },
      beforeUpload: this.beforeUpload,
      onChange: (fl) => {
        handleChange(fl)
      },
    }
    if (fileList.length > 1) {
      uploadProp.fileList = fileList
    }
    if (uploadType === 'single') {
      return (
        <Upload {...uploadProp} >
          {this.imagesRender(fileList)}
        </Upload>
      )
    }
    return (
      <QiniuPicturesWall {...uploadProp} />
    )
  }
}

QiniuUploader.propTypes = {
  uploadLimit: PropTypes.number,
  token: PropTypes.string,
  uploadKey: PropTypes.string,
  imageType: PropTypes.string,
  fileList: PropTypes.array,
  uploadType: PropTypes.string,
  handleChange: PropTypes.func,
  handleRemove: PropTypes.func,
  fileCount: PropTypes.number,
}

export default QiniuUploader

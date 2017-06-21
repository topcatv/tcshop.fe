import React from 'react'
import PropTypes from 'prop-types'
import styles from './QiniuUploader.less'
import { Upload, Icon, message } from 'antd'

class QiniuUploader extends React.Component {
  state = {}

  getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
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

  render () {
    const { token, uploadKey, handleChange, defaultImageUrl } = this.props
    return (
      <Upload
        className={styles.avatar_uploader}
        name="file"
        showUploadList={false}
        action="http://upload-z2.qiniu.com"
        data={{
          token,
          key: uploadKey,
        }}
        beforeUpload={this.beforeUpload}
        onChange={handleChange}
      >
        {
          defaultImageUrl ?
            <img src={defaultImageUrl} alt="" className={styles.avatar} /> :
            <Icon type="plus" className={styles.avatar_uploader_trigger} />
        }
      </Upload>
    )
  }
}

QiniuUploader.propTypes = {
  uploadLimit: PropTypes.number,
  token: PropTypes.string,
  uploadKey: PropTypes.string,
  imageType: PropTypes.string,
  defaultImageUrl: PropTypes.string,
  handleChange: PropTypes.func,
}

export default QiniuUploader

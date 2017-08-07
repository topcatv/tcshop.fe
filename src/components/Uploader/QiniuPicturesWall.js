import React from 'react'
import PropTypes from 'prop-types'
import { PRO_URL, PRO_QINIU, PRO_COMMON } from 'react-lz-editor/global/supports/publicDatas'
import styles from './QiniuPicturesWall.less'
import _ from 'lodash'
import { Upload, Icon, Modal, message } from 'antd'

class QiniuPicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.fileList,
    qiniu: {
      token: this.props.uploadConfig && Object.keys(this.props.uploadConfig).length ? PRO_QINIU.checkQiniu.returnToken(this.props.uploadConfig) : null,
    },
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.fileList.length !== this.props.fileList.length || _.differenceWith(nextProps.fileList, this.props.fileList, (value, other) => { return value.url === other.url }).length > 0) {
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
      message.error('上传图片格式不正确')
    }
    const isLt = file.size / 1024 / 1024 < this.props.uploadLimit
    if (!isLt) {
      message.error(`图片大小必须小于${this.props.uploadLimit}M`)
    }
    return isJPG && isLt
  }

  renderFileList = (uploadButton) => {
    if (!this.props.fileCount) {
      return uploadButton
    }
    return (this.state.fileList.length >= this.props.fileCount ? null : uploadButton)
  }

  render () {
    const { handleChange } = this.props.uploadConfig
    const { previewVisible, previewImage } = this.state
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className={styles['ant-upload-text']}>上传</div>
      </div>
    )
    let that = this
    const uploadProp = {
      name: 'file',
      action: PRO_URL.QINIU_URL || this.props.uploadConfig.QINIU_URL,
      data: (file) => { // 支持自定义保存文件名、扩展名支持
        let token = that.state.qiniu.token
        let key = ''
        if (!token) {
          token = PRO_QINIU.checkQiniu.returnToken(this.props.uploadConfig)
        }
        /* eslint new-cap: "off" */
        key = `${PRO_COMMON.String.RndNum(20)}.${PRO_COMMON.String.GetFileExtensionName(file.name)[0]}`
        if (this.props.uploadConfig.QINIU_KEY_PREFIX) {
          key = `${this.props.uploadConfig.QINIU_KEY_PREFIX}/${key}`
        }
        return { token, key }
      },
      beforeUpload: this.beforeUpload,
      onChange: (fl) => {
        handleChange(fl)
        this.setState({ fileList: fl.fileList.slice() })
      },
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
  imageType: PropTypes.string,
  fileList: PropTypes.array,
  fileCount: PropTypes.number,
  uploadConfig: PropTypes.shape({
    QINIU_URL: PropTypes.string.isRequired,
    QINIU_IMG_TOKEN_URL: PropTypes.string.isRequired,
    QINIU_KEY_PREFIX: PropTypes.string,
    QINIU_PFOP: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }),
    QINIU_VIDEO_TOKEN_URL: PropTypes.string.isRequired,
    QINIU_FILE_TOKEN_URL: PropTypes.string.isRequired,
    QINIU_DOMAIN_IMG_URL: PropTypes.string.isRequired,
    QINIU_DOMAIN_VIDEO_URL: PropTypes.string.isRequired,
    QINIU_DOMAIN_FILE_URL: PropTypes.string.isRequired,
    handleChange: PropTypes.func,
  }),
}

export default QiniuPicturesWall

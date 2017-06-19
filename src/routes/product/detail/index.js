import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'

const Detail = ({ productDetail }) => {
  const { item } = productDetail
  const content = []
  for (let key in item) {
    if ({}.hasOwnProperty.call(item, key)) {
      content.push(<div key={key} className={styles.item}>
        <div>{key}</div>
        <div>{String(item[key])}</div>
      </div>)
    }
  }
  return (<div className="content-inner">
    <div className={styles.content}>
      {content}
    </div>
  </div>)
}

Detail.propTypes = {
  productDetail: PropTypes.object,
}

export default connect(({ productDetail }) => ({ productDetail }))(Detail)

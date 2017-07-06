import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { QINIU_IMG_HOST } from '../../../utils/config'
import QiniuPicturesWall from '../../../components/Uploader/QiniuPicturesWall'
import _ from 'lodash'
import styles from './index.less'
import { Form, Input, Row, Col, Button, Modal, Radio, InputNumber, Select, Icon } from 'antd'

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
    getFieldValue,
    setFieldsValue,
  },
}) => {
  const { item, upload,brands } = productDetail

  function handleOk () {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        id: item.id,
      }
      data.tags = _.join(data.tags, ',')
      data.pics = _.join(_.map(data.pics, (pic) => { return pic.uid }), ',')
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

  const handleChange = (info) => {
    if (info.fileList.length > 0 && _.every(info.fileList, ['status', 'done'])) {
      dispatch({
        type: 'productDetail/picShow',
        payload: {
          ns: 'product',
          pics: _.map(info.fileList, (f) => {
            return f.response ? f.response.key : f.uid
          }),
        },
      })
    }
  }

  const fileList = []

  if (item.pics) {
    _.each(_.split(item.pics, ','), (pic) => {
      fileList.push({
        uid: pic,
        name: `${pic}_detail`,
        status: 'done',
        url: `${QINIU_IMG_HOST}/${pic}_detail`,
      })
    })
  }

  let tags = _.split(item.tags, ',')
  const children = []
  _.each(tags, (tag) => {
    if (tag !== '') {
      children.push(<Option key={tag}>{tag}</Option>)
    }
  })
  if (tags.length === 1 && tags[0] === '') {
    tags = undefined
  }

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 18, offset: 6 },
    },
  }
  const sku = _.zipWith(item.goodsName, item.goodsPrice, item.goodsStock, (name, price, stock) => {
    return {
      name,
      price,
      stock,
    }
  })
  getFieldDecorator('skus', { initialValue: sku })
  const skus = getFieldValue('skus')
  const skuList = skus.map((s, index) => {
    return (
      <Row key={index}>
        <Col span={4} offset={6}>
          <FormItem hasFeedback>
            {getFieldDecorator(`goodsname_${index}`, {
              initialValue: s.name,
              rules: [],
            })(
              <Input placeholder="规格" />
            )}
          </FormItem>
        </Col>
        <Col span={6} offset={2}>
          <FormItem hasFeedback>
            {getFieldDecorator(`goodsprice_${index}`, {
              initialValue: s.price,
              rules: [],
            })(
              <InputNumber
                min={0}
                precision={2}
                placeholder="价格"
              />
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem hasFeedback>
            {getFieldDecorator(`goodsstock_${index}`, {
              initialValue: s.stock,
              rules: [],
            })(
              <InputNumber
                min={0}
                precision={0}
                placeholder="库存"
              />
            )}
          </FormItem>
        </Col>
        <Col span={2}>
          <Icon
            className={styles['dynamic-delete-button']}
            type="minus-circle-o"
            disabled={sku.length === 1}
          />
        </Col>
      </Row>
    )
  })
  const addSku = () => {
    const _skus = getFieldValue('skus')
    const nextSkus = _skus.concat({})
    // can use data-binding to set
    // important! notify form to detect changes
    setFieldsValue({
      skus: nextSkus,
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
            {getFieldDecorator('brandId', {
               initialValue: `${item.brandId ? item.brandId : ''}`,
              rules: [],
            })(<Select     
              placeholder="请选择品牌"
            >
        {brands.map(d => <Option key={d.id}>{d.name}</Option>)}
      </Select>)}
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
              <RadioGroup options={[
                {
                  label: '实物商品',
                  value: '1',
                },
                {
                  label: '虚拟商品',
                  value: '2',
                },
              ]} />
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
              initialValue: fileList,
              valuePropName: 'fileList',
              rules: [],
            })(
              <QiniuPicturesWall
                imageType="image/jpeg"
                uploadLimit={2}
                handleChange={handleChange}
                token={upload.token}
                uploadKey={upload.key}
              />
            )}
        </FormItem>
        <FormItem label="标签" hasFeedback {...formItemLayout}>
            {getFieldDecorator('tags', {
              initialValue: tags,
              rules: [],
            })(
              <Select
                mode="tags"
                tokenSeparators={[',']}
                style={{ width: '100%' }}
                searchPlaceholder="标签"
              >
                {children}
              </Select>
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
        {skuList}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={addSku} style={{ width: '60%' }}>
            <Icon type="plus" /> 添加规格
          </Button>
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

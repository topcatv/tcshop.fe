import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
<<<<<<< HEAD
import { Form, Input, Row, Col, Button, Modal,  InputNumber,TreeSelect,Select } from 'antd'
=======
import { Form, Input, Row, Col, Button, Modal, InputNumber, TreeSelect } from 'antd'
>>>>>>> b3fc360188bb08eb206de57aea3f72efddbb545c

const FormItem = Form.Item
const confirm = Modal.confirm
const TreeNode = TreeSelect.TreeNode
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const Edit = ({
  categoryDetail,
  dispatch,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const { item, allCategory } = categoryDetail

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
          type: 'categoryDetail/update',
          payload: {
            ...data,
          },
        })
      } else {
        dispatch({
          type: 'categoryDetail/create',
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

  function changeTree (value) {
       this.setState({
      ...this.state,
      selectValue: item.parentId,
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
        <FormItem label="父分类" hasFeedback {...formItemLayout}>
            {getFieldDecorator('parentId', {
              initialValue: `${item.parentId ? item.parentId : ''}`,
              rules: [],
            })(  
            <TreeSelect
              showSearch
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              allowClear
              treeData={allCategory}
              treeDefaultExpandAll
              onChange={changeTree}
            >
      </TreeSelect>)}
        </FormItem>
        <FormItem label="分类名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [],
            })(<Input />)}
        </FormItem>
        <FormItem label="位置" hasFeedback {...formItemLayout}>
            {getFieldDecorator('position', {
              initialValue: item.position,
              rules: [],
            })(
              <InputNumber
                min={0}
                precision={0}
              />
            )}
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
  categoryDetail: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ categoryDetail }) => ({ categoryDetail }))(Form.create()(Edit))

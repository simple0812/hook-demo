/****** create file by codeGen ******/
import React, { Component } from 'react';
import { Drawer, Button, Spin } from 'antd';
import { Form } from '@ant-design/compatible';

import styles from './index.less';

@Form.create()
export default class DetailForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { didMountCallback } = this.props;
    didMountCallback && didMountCallback();
  }

  onClose = () => {
    const { onClose } = this.props;
    onClose(false);
  };

  handleSubmit = (e) => {
    const { onSave } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onSave(values);
      }
    });
  };

  render() {
    const { visible, postTitle, formItemList, form, width, loading } =
      this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 }
    };

    return (
      <Drawer
        title={postTitle}
        maskClosable={false}
        className={styles.classes_detail_form}
        width={width || 958}
        placement="right"
        onClose={this.onClose}
        visible={visible}>
        {loading === 'pending' ? (
          <Spin />
        ) : (
          <Form {...formItemLayout}>
            {formItemList.map((item, index) => {
              const {
                label,
                key,
                option,
                component,
                extra,
                componentObj,
                itemLayout = {}
              } = item;
              const { cComponent, cProps } = componentObj || {};
              return (
                <Form.Item {...itemLayout} label={label} key={index}>
                  {getFieldDecorator(
                    key,
                    option
                  )(
                    componentObj
                      ? React.createElement(
                          cComponent,
                          { ...cProps, form },
                          null
                        )
                      : component
                  )}
                  {extra}
                </Form.Item>
              );
            })}
          </Form>
        )}
        <div className={`${styles.group_btns} right`}>
          <Button onClick={this.onClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={this.handleSubmit} type="primary">
            保存
          </Button>
        </div>
      </Drawer>
    );
  }
}

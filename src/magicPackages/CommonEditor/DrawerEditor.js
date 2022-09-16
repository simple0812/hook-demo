import React from 'react';
import { Form, Button, message, Drawer, Row } from 'antd';

import Icon from '@/components/Icon/AntIcon';

import styles from './index.less';
import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import BaseForm from './BaseForm';

class CommonEditor extends BaseForm {
  static propTypes = {
    cmdContainerStyle: PropTypes.object,
    editorItems: PropTypes.array
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      visible: false
    };
  }

  render() {
    let {
      editorData = {},
      editorMethods = {},
      model = {},
      globalLoading = {},
      isUpdate,
      title,
      style,
      onSave,
      pageTitle,
      isReadonly,
      visibleType,
      ...restProps
    } = this.props;
    // 需要深clone 否则原始数据会被修改 导致bug
    let submitLoading = globalLoading.create;

    if (isUpdate) {
      submitLoading = globalLoading.update;
    }

    return (
      <Drawer
        title={title}
        width={800}
        placement="right"
        onClose={this.handelClose.bind(this, null)}
        maskClosable
        destroyOnClose
        visible={this.props.visible}
        style={{
          ...style
        }}
        className={classNames('commonEditDrawer', this.props.className)}
        {...restProps}
      >
        <div className="draw-content">
          {globalLoading.$getDetail === 'pending' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}
            >
              <Icon type="loading" style={{ fontSize: 30 }} />
            </div>
          ) : (
            <Form>
              <Row>{this.renderFormItem(editorData, isReadonly)}</Row>
            </Form>
          )}
        </div>
        <div className="draw-footer">
          <Button
            onClick={this.handelClose.bind(this, null)}
            style={{ marginRight: 8 }}
          >
            取消
          </Button>
          <Button
            disabled={isReadonly || globalLoading.$getDetail === 'pending'}
            loading={submitLoading === 'pending'}
            type="primary"
            onClick={this.handleSubmit}
          >
            保存
          </Button>
          {this.props.extraButtons}
        </div>
      </Drawer>
    );
  }
}

export default CommonEditor;

// export default Form.create({
//   name: 'drawer_form_' + String(Math.random()).slice(2) // 使用随机数来避免页面出现id相同的组件

//   // 完全受控 需要配合onValuesChange 和 onFieldsChange 来使用 逻辑复杂
//   // mapPropsToFields(props) {
//   //   let { model, editorItems = [] } = props;
//   //   console.log('mapPropsToFields', props);

//   //   let ret = {};

//   //   if (_.isEmpty(editorItems)) {
//   //     return {};
//   //   }

//   //   editorItems.forEach((item) => {
//   //     let key = item.id;
//   //     let val = model[key];

//   //     if (_.isFunction(item.convertModelToControl)) {
//   //       val = item.convertModelToControl(val, { source: item, props });
//   //     }

//   //     ret[key] = Form.createFormField({
//   //       value: val
//   //     });
//   //   });

//   //   return ret;
//   // }
// })(CommonEditor);

import React from 'react';
import { Form, Button, Row } from 'antd';

import Icon from '@/components/Icon/AntIcon';
import _ from 'lodash';
import PropTypes from 'prop-types';

import editorFactroy from './editorFactroy';
import BaseForm from './BaseForm';
import generateEditorFormData from './generateEditorFormData';

import './index.less';

class CommonForm extends BaseForm {
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
      globalLoading = {},
      isUpdate,
      title,
      style,
      onSave,
      pageTitle,
      isReadonly,
      visibleType,
      colCount,
      editorData,
      saveHidden,
      closeHidden,
      ...restProps
    } = this.props;
    // 需要深clone 否则原始数据会被修改 导致bug
    let submitLoading = globalLoading.create;

    if (isUpdate) {
      submitLoading = globalLoading.update;
    }

    return (
      <Form
        name={`common_form_${String(Math.random()).slice(2)}`}
        ref={(ref) => this.$form = ref}
        className="commonEditForm">
        <div className="common-form-content">
          {globalLoading.$getDetail == 'pending' ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}>
              <Icon type="loading" style={{ fontSize: 30 }} />
            </div>
          ) : (
            <Row>{this.renderFormItem(editorData, isReadonly, colCount)}</Row>
          )}
        </div>
        <div className="common-form-footer">
          {!closeHidden && (
            <Button
              onClick={this.handelClose.bind(this, null)}
              style={{ marginRight: 8 }}>
              关闭
            </Button>
          )}

          {!saveHidden && (
            <Button
              disabled={isReadonly || globalLoading.$getDetail === 'pending'}
              loading={submitLoading === 'pending'}
              type="primary"
              onClick={this.handleSubmit}>
              保存
            </Button>
          )}

          {this.props.extraButtons}
        </div>
      </Form>
    );
  }
}

export default CommonForm;

// export default Form.create({
//   name: `common_form_${String(Math.random()).slice(2)}` // 使用随机数来避免页面出现id相同的组件
// })(CommonForm);

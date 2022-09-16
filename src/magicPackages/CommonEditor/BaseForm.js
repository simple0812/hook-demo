import React from 'react';
import { Form, Button, message, Row, Col } from 'antd';

import Icon from '@/components/Icon/AntIcon';

import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import generateEditorFormData from './generateEditorFormData';
import editorFactroy from './editorFactroy';

import styles from './index.less';

export default class BaseForm extends React.Component {
  static propTypes = {
    cmdContainerStyle: PropTypes.object,
    editorItems: PropTypes.array
  };

  static defaultProps = {};

  getSearchConditions = () => {
    const { editorItems } = this.props;
    var conditions = _.cloneDeep(this.props.form.getFieldsValue());

    _.keys(conditions).forEach((key) => {
      var val = conditions[key];
      let source =
        _.find(this.editorItems || editorItems, (each) => each.id === key) ||
        {};
      if (_.isFunction(source.convertControlToModel)) {
        conditions[key] = source.convertControlToModel(val, {
          source,
          props: this.props,
          conditions,
          key
        });
      }
    });

    let xPrams = _.omitBy(conditions, _.isUndefined);
    return xPrams;
  };

  validateConditions = () => {
    var conditions = this.props.form.getFieldsValue();
    const { editorItems } = this.props;
    let ret = true;

    _.keys(conditions).forEach((key) => {
      var val = conditions[key];
      let source =
        _.find(this.editorItems || editorItems, (each) => each.id === key) ||
        {};
      if (_.isFunction(source.validate)) {
        let msg = source.validate(val, {
          source,
          props: this.props,
          conditions,
          key
        });

        if (msg) {
          message.warning(msg);
          ret = false;
          return;
        }
      }
    });

    return ret;
  };

  // 验证数据 成功后触发事件
  handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    const { onSave, editorMethods: { beforeSubmit, afterSubmit } = {} } =
      this.props;

    try {
      let params = await this.formValidate(e);
      if (!_.isFunction(onSave)) {
        return;
      }
      if (_.isFunction(beforeSubmit)) {
        let msg = beforeSubmit(params, this.props.model);
        if (msg) {
          message.warning(msg);
          return;
        }
      }

      let promise = onSave(params, this.props.model);

      if (
        promise &&
        _.isFunction(promise.then) &&
        _.isFunction(promise.catch)
      ) {
        let pRes = await promise;
        if (pRes?.code == 0 || pRes?.code == 200) {
          this.props.form.resetFields();
        }
      }
    } catch (e) {}
  };

  // 只验证数据 不触发事件
  formValidate = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    return new Promise((resolve, reject) => {
      this.props.form.validateFieldsAndScroll((err, values) => {
        // form表单验证有效性
        if (err) {
          reject(new Error(err));
          return;
        }

        // 额外验证参数的有效性
        let errMsg = this.validateConditions();
        if (!errMsg) {
          reject(new Error(errMsg));
          return;
        }

        let xParams = this.getSearchConditions();
        let params = { ...xParams };

        resolve(params);
      });
    });
  };

  handleFormChange = async (fields) => {
    const { onSave, editorMethods: { beforeSubmit, afterSubmit } = {} } =
      this.props;

    try {
      let params = await this.validateFields(fields);
      if (!_.isFunction(onSave)) {
        return;
      }
      if (_.isFunction(beforeSubmit)) {
        let msg = beforeSubmit(params, this.props.model);
        if (msg) {
          message.warning(msg);
          return;
        }
      }

      let promise = onSave(params, this.props.model);

      if (
        promise &&
        _.isFunction(promise.then) &&
        _.isFunction(promise.catch)
      ) {
        let pRes = await promise;
        if (pRes?.code == 0 || pRes?.code == 200) {
          this.props.form.resetFields();
        }
      }
    } catch (e) {}
  };

  validateFields = (fields) => {
    return new Promise((resolve, reject) => {
      this.props.form.validateFields(fields, (err, values) => {
        // form表单验证有效性
        if (err) {
          reject(new Error(err));
          return;
        }

        let xParams = this.getSearchConditions();
        let params = { ...xParams };

        resolve(params);
      });
    });
  };

  handelClose = () => {
    const { onClose } = this.props;
    this.props.form.resetFields();
    if (_.isFunction(onClose)) {
      onClose();
    }
  };

  toggleExpand = (id) => {
    let { collapseList } = this.state;
    if (!collapseList) {
      collapseList = [];
    }
    let xIndex = collapseList.indexOf(id);
    if (xIndex >= 0) {
      collapseList.splice(xIndex, 1);
    } else {
      collapseList.push(id);
    }

    this.setState({
      collapseList
    });
  };

  renderFormItem = (editorDataList, isReadonly = false, colCount = 1) => {
    const { collapseList } = this.state;
    let xList = generateEditorFormData({
      editorData: editorDataList,
      isReadonly
    });
    return xList.map((source) => {
      if (source.control == 'zone') {
        let zoneItems = this.renderFormItem(
          source.children,
          isReadonly,
          colCount
        );
        if (_.isEmpty(zoneItems)) return '';

        let isShow = (collapseList || []).indexOf(source.id) == -1;
        return (
          <div className="zone-area" key={source.id}>
            {source.label && (
              <div span={24} className="zone-head">
                <span className="zone-head-title">{source.label}</span>
                <span
                  className="zone-head-more"
                  onClick={this.toggleExpand.bind(this, source.id)}
                >
                  {isShow ? '收起' : '展开'}
                  <Icon type={isShow ? 'up' : 'down'} />
                </span>
              </div>
            )}

            {isShow && <Row className="zone-body">{zoneItems}</Row>}
          </div>
        );
      }

      source.fieldDecorator = source.fieldDecorator || {};
      let editorCom = editorFactroy(source.control);
      if (!source.colSpan) {
        source.colSpan = 24 / colCount;
      }

      if (this.props.formItemProps && !source.formItemProps) {
        source.formItemProps = {
          ...this.props.formItemProps
        };
      }

      return editorCom(source, this.props);
    });
  };
}

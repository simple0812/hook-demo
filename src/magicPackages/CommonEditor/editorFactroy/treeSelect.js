import React from 'react';
import defaultEditor from './defaultEditor';
import { TreeSelect } from 'antd';
import _ from 'lodash';
import {
  renderTreeNodeWithArray,
  renderTreeNodeWithTreeData
} from '@/magicPackages/utils/treeHelper';
const { TreeNode } = TreeSelect;

export default function (source, props) {
  // 使用数组渲染组件

  source.control = TreeSelect;
  source.controlProps = {
    placeholder: '请选择',
    allowClear: true,
    getPopupContainer: (node) => node,
    treeDataSimpleMode: true,
    dropdownStyle: { maxHeight: 300, overflow: 'auto' },
    ...source.controlProps
  };

  if (_.isFunction(source.options)) {
    source.controlProps.treeData = source.options();
  } else {
    source.controlProps.treeData = source.options || [];
  }

  if (source.required) {
    source.fieldDecorator = source.fieldDecorator || {};
    source.fieldDecorator.rules = source.fieldDecorator.rules || [];
    let xRules = _.get(source, 'fieldDecorator.rules') || [];

    if (!xRules.find((each) => each.required)) {
      source.fieldDecorator.rules.push({
        required: true,
        message:
          '请选择' +
          (_.isFunction(source.label)
            ? source.label({ source, props })
            : source.label)
      });
    }
  }

  if (!_.isFunction(source.convertControlToModel)) {
    source.convertControlToModel = (val, { source, props, conditions }) => {
      if (_.isEmpty(val)) {
        return val;
      }
      return (val || []).filter((each) => each !== 'nil');
    };
  }

  return defaultEditor(source, props);
}

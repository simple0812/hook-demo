import React from 'react';
import defaultEditor from './defaultEditor';
import MetaSelect from '../components/MetaSelect';
import { Select } from 'antd';
import _ from 'lodash';

export default function (source, props) {
  source.control = MetaSelect;
  source.controlProps = {
    placeholder: '请选择',
    allowClear: true,
    getPopupContainer: (node) => node,
    idKey: 'id', // 数据源列表中 id字段
    labelKey: 'name', // 数据源列表中 label字段
    ...source.controlProps
  };

  //mapLabelKey: 详情对象中对应label字段
  if (!source.controlProps.mapLabelKey) {
    source.controlProps.mapLabelKey = source.controlProps.labelKey;
  }

  if (!source.controlProps.mapIdKey) {
    source.controlProps.mapIdKey = source.controlProps.idKey;
  }

  if (
    source.options &&
    !_.isFunction(source.renderChildren) &&
    !source.controlProps.children
  ) {
    let xOptions = [];

    if (_.isFunction(source.options)) {
      xOptions = [...source.options({ source, props })];
    } else {
      xOptions = [...source.options];
    }

    if (_.isArray(xOptions) && !_.isEmpty(xOptions)) {
      source.controlProps.children = [...xOptions].map((each) => (
        <Select.Option dataref={each} key={each.key} value={each.key}>
          {each.label}
        </Select.Option>
      ));
    }
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
      return val?.key || '';
    };
  }

  if (!_.isFunction(source.convertModelToControl)) {
    source.convertModelToControl = (val, { source, props }) => {
      const { model, idKey, mapLabelKey } = props || {};
      if (!val) {
        return undefined;
      }

      return { key: val, label: _.get(model, mapLabelKey) };
    };
  }

  return defaultEditor(source, props);
}

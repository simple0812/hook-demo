import React from 'react';
import defaultEditor from './defaultEditor';
import MetaTreeSelect from '../components/MetaTreeSelect';
import { Select } from 'antd';
import _ from 'lodash';

export default function (source, props) {
  source.control = MetaTreeSelect;
  source.controlProps = {
    idKey: 'id', // 数据源列表中 id字段
    labelKey: 'name', // 数据源列表中 label字段
    ...source.controlProps
  };

  //mapLabelKey: 详情对象中对应label字段
  if (!source.controlProps.mapLabelKey) {
    source.controlProps.mapLabelKey = source.controlProps.labelKey;
  }

  if (!source.controlProps.mapIdKey) {
    source.controlProps.mapIdKey = source.key;
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
      console.log('val', val);
      if (!val) return val;

      // 过滤掉一级标签的数据
      let x = val
        .filter((item) => String(item.value).indexOf('_') == 0)
        .map((item) => item.value.replace('_', ''));

      if (_.isEmpty(x)) {
        return undefined;
      }

      return x;
    };
  }

  if (!_.isFunction(source.convertModelToControl)) {
    source.convertModelToControl = (val, { source, props }) => {
      let { idKey, labelKey, mapLabelKey } = source.controlProps;
      if (!val) return undefined;
      if (!props?.model || !props?.model[mapLabelKey]) {
        return undefined;
      }

      return props?.model[mapLabelKey].map((item) => ({
        key: '_' + item[idKey],
        value: '_' + item[idKey],
        label: item[labelKey]
      }));
    };
  }

  return defaultEditor(source, props);
}

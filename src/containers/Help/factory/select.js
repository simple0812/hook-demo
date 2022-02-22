import { Select } from 'antd';
import _ from 'lodash';
import helper from './helper';

export default function (formItemData) {
  let xData = helper(formItemData, Select);
  let xOptions = [];

  if (_.isFunction(formItemData.options)) {
    xOptions = formItemData.options();
  }

  if (formItemData.options && _.isObject(formItemData.options)) {
    xOptions = _.keys(formItemData.options).map((xkey) => ({
      value: xkey,
      label: formItemData.options[xkey]
    }));
  }

  if (!formItemData.controlProps.options) {
    xData.controlProps.options = xOptions;
  }

  if (!formItemData.controlProps.placeholder) {
    xData.controlProps.placeholder = `请选择${formItemData.label}`;
  }

  return xData;
}

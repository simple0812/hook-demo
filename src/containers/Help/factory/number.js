import { InputNumber } from 'antd';
import _ from 'lodash';
import NumberCom from '../components/Number';
import helper from './helper';

export default function (formItemData) {
  let xData = helper(formItemData, NumberCom);

  if (!formItemData.controlProps.placeholder) {
    xData.controlProps.placeholder = `请输入${formItemData.label}`;
  }

  if (_.isUndefined(formItemData.controlProps.precision)) {
    xData.controlProps.precision = 0;
  }

  return xData;
}

import { Cascader } from 'antd';
import helper from './helper';

export default function (formItemData) {
  let xData = helper(formItemData, Cascader);

  if (!formItemData.controlProps.placeholder) {
    xData.controlProps.placeholder = `请选择${formItemData.label}`;
  }

  return xData;
}

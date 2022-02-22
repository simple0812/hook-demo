import { Input } from 'antd';
import helper from './helper';

export default function (formItemData) {
  let xData = helper(formItemData, Input);

  if (!formItemData.controlProps.placeholder) {
    xData.controlProps.placeholder = `请输入${formItemData.label}`;
  }

  return xData;
}

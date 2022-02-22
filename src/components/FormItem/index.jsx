import React from 'react';
import { Row, Col, Form, Input, Button, Radio } from 'antd';
import {
  BInput,
  BRadio,
  BSelect,
  BCascader,
  BDate,
  BUpload,
  BDay
} from './items';

const BFormItem = (props) => {
  // console.log('BFormItem props', props);
  const { formItemKey = '', ...formItemProps } = props;
  const { type = 'input' } = formItemProps;

  let item = null;
  switch (type) {
    case 'date':
      item = <BDate {...formItemProps}></BDate>;
      break;
    case 'radio':
      item = <BRadio {...formItemProps}></BRadio>;
      break;
    case 'select':
      item = <BSelect {...formItemProps}></BSelect>;
      break;
    case 'address':
      item = <BCascader {...formItemProps}></BCascader>;
      break;
    case 'day':
      item = <BDay {...formItemProps}></BDay>;
      break;
    case 'upload':
      item = <BUpload {...formItemProps}></BUpload>;
      break;
    default:
      item = <BInput {...formItemProps}></BInput>;
      break;
  }

  return item;
};
export default BFormItem;

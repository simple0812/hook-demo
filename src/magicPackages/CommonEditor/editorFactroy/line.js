// 编辑器 分行 防止一行放2个数据的时候页面错乱

import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';
import defaultEditor from './defaultEditor';

export default function (source, props) {
  source.control = 'div';
  source.useCustomItem = true;
  source.controlProps = {
    ...source.controlProps
  };

  source.formItemProps = {
    colon: false,
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      lg: { span: 24 },
      xl: { span: 24 }
    },
    wrapperCol: {
      xs: { span: 0 },
      sm: { span: 0 },
      lg: { span: 0 },
      xl: { span: 0 }
    },
    ...source.formItemProps
  };

  source.colItemStyle = {
    border: '0px solid #ccc',
    fontWeight: 'bold',

    height: 1,
    overflow: 'hidden',
    margin: 0,

    ...source.colItemStyle
  };

  source.colSpan = source.colSpan || 24;

  return defaultEditor(source, props);
}

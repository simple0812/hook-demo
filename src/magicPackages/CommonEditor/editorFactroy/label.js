import React from 'react';
import defaultEditor from './defaultEditor';
import { Select } from 'antd';
import _ from 'lodash';

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
    lineHeight: '32px',
    // borderBottom: '1px solid #ccc',

    marginBottom: '16px',

    color: 'rgba(0,0,0,0.85)',
    ...source.colItemStyle
  };

  source.labelStyle = {
    fontWeight: 'bold',
    fontSize: 14,
    ...source.labelStyle
  };

  source.colSpan = source.colSpan || 24;

  if (!_.isFunction(source.convertControlToModel)) {
    source.convertControlToModel = (val, { source, props, conditions }) => {
      return undefined;
    };
  }

  if (!_.isFunction(source.convertModelToControl)) {
    source.convertModelToControl = (val, { source, props }) => {
      return val;
    };
  }

  return defaultEditor(source, props);
}

import React from 'react';
import * as Icon from '@ant-design/icons';

export default function ({ type, ...restProps }) {
  if (Icon[type]) {
    return React.createElement(Icon[type], {
      ...restProps
    });
  }

  return <img src={type} {...restProps} alt="" />;
}

import React from 'react';
import * as Icon from '@ant-design/icons';

export default function ({ type, ...restProps }) {
  if (Icon[type]) {
    return React.createElement(Icon[type], {
      ...restProps
    });
  }

  // 兼容3.x的icon 将3.x的type类型转换成4.x的
  let xArr = type.split('-');
  let newType = '';
  xArr.forEach((item) => {
    newType += item[0].toUpperCase() + item.slice(1);
  });

  newType += 'Outlined';

  if (Icon[newType]) {
    return React.createElement(Icon[newType], {
      ...restProps
    });
  }

  return <img src={type} {...restProps} alt="" />;
}

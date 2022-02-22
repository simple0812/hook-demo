import React from 'react';
import { Input } from 'antd';

const BInput = (props) => {
  const { label, rules, disabled, htmlType, ...inputProps } = props;
  //console.log('input', props);
  return (
    <Input
      disabled={disabled}
      placeholder={disabled ? '' : `请输入${label}`}
      {...inputProps}
    />
  );
};
export default BInput;

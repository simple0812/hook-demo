import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const BSelect = (props) => {
  const { disabled = false, options = [], value, label, onChange } = props;
  const placeholder = `请选择${label}`;
  return (
    <Select
      disabled={disabled}
      options={options}
      value={value}
      placeholder={!disabled ? placeholder : ''}
      onChange={onChange}
    ></Select>
  );
};
export default BSelect;

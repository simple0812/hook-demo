import React from 'react';
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

const BDate = (props) => {
  return (
    <RangePicker
      placeholder={props?.disabled ? '' : [`请选择开始时间`, `请选择结束时间`]}
      {...props}
    />
  );
};
export default BDate;

import React from 'react';
import { Radio } from 'antd';

const BRadio = (props) => {
  const { options = [], onChange, value, disabled } = props;
  //console.log('radio', props);

  return (
    <Radio.Group
      options={options}
      value={value}
      disabled={disabled}
      onChange={onChange}></Radio.Group>
  );
};
export default BRadio;

import React from 'react';
import Upload from '@/magicPackages/CommonEditor/components/Upload';

const BUpload = (props) => {
  const { onChange, value } = props;
  return (
    <Upload
      onChange={onChange}
      value={value}
      maxSize="20M"
      accept=".jpg,.png,.jpeg"
    />
  );
};
export default BUpload;

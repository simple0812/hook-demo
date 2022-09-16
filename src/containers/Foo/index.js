import { Button, Checkbox, Form, Input } from 'antd';
import React from 'react';
import CombineSearch from '@/magicPackages/CombineSearch';

const App = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <CombineSearch
      model={{}}
      wrappedComponentRef={(ref) => (this.combineSearchRef = ref)}
      searchData={{
        id: 'id',
        name:  {
          label:'名称',
          control:'select',
          options: () => ([
            {key: 1, value: '1', label: '111'},
            {key: 11, value: '2', label: '222'},
          ])
        },
        name1: '名称1',
        name2: '名称2',
        name3: '名称3',
        name4: '名称4',
        name5: '名称5',
        name6: '名称6',
        name7: '名称7',
        name8: '名称8',
        name9: '名称9',
        name10: '名称10',
        name11: '名称11',
        name12: '名称12'
      }}
      onSearch={onFinish}
    />
  );
};

export default App;

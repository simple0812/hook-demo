import React from 'react';
import { Input } from 'antd';
import _ from 'lodash';
import SearchItemWrapper from '../SearchItemWrapper';

export default {
  comp: function (source, props) {
    const { getFieldDecorator } = props.form;

    const { style, ...restControlProps } = source.controlProps || {};

    return (
      <SearchItemWrapper model={source} key={source.id}>
        {getFieldDecorator(source.id, { ...source.fieldDecorator })(
          <Input
            style={{ width: '100%', ...style }}
            autoComplete="off"
            allowClear
            placeholder={`请输入${source.label}`}
            {...restControlProps}
          />
        )}
      </SearchItemWrapper>
    );
  },
  parseValue: function (value, searcherData, { conditions, key, props } = {}) {
    let xVal = value?.length ? value : undefined;
    if (_.isFunction(searcherData.convertToSearchFormat)) {
      return searcherData.convertToSearchFormat(xVal, {
        conditions,
        key,
        props
      });
    }

    return xVal;
  }
};

import React from 'react';
import { InputNumber } from 'antd';
import _ from 'lodash';
import SearchItemWrapper from '../SearchItemWrapper';

export default {
  comp: function (source, props) {
    const { getFieldDecorator } = props.form;
    const { style, ...restControlProps } = source.controlProps || {};
    return (
      <SearchItemWrapper model={source} key={source.id}>
        {getFieldDecorator(
          source.id,
          source.fieldDecorator
        )(
          <InputNumber
            style={{ width: '100%', ...style }}
            allowClear
            placeholder={`请输入${source.label}`}
            {...restControlProps}
          />
        )}
      </SearchItemWrapper>
    );
  },
  parseValue: function (value, searcherData, { conditions, key, props } = {}) {
    if (_.isFunction(searcherData.convertToSearchFormat)) {
      return searcherData.convertToSearchFormat(value, {
        conditions,
        key,
        props
      });
    }

    return value;
  }
};

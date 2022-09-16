import React from 'react';
import { Select } from 'antd';
import YlSelect from '@/magicPackages/YlSelect';
import _ from 'lodash';
import SearchItemWrapper from '../SearchItemWrapper';
import AutoSizer from 'react-virtualized-auto-sizer';

export default {
  comp: function (source, props) {
    const { getFieldDecorator } = props.form;
    const { style, ...restControlProps } = source.controlProps || {};

    source.options = source.options || [];
    if (_.isFunction(source.options)) {
      source.options = source.options();
    }

    if (!_.isArray(source.options)) {
      source.options = _.keys(source.options).map((xkey) => ({
        value: xkey,
        label: source.options[xkey]
      }));
    }

    let { initialValue, ...restFieldDecorator } = source.fieldDecorator || {};

    if (restControlProps.mode === 'multiple') {
      initialValue = [];
    }

    return (
      <SearchItemWrapper
        model={source}
        key={source.id}
        ref={(ref) => (this.rootRef = ref)}
      >
        <AutoSizer>
          {({ width, height }) =>
            getFieldDecorator(source.id, {
              initialValue,
              ...restFieldDecorator
            })(
              <YlSelect
                placeholder="请选择"
                style={{ width: width - 2, height: 32, ...style }}
                allowClear
                getPopupContainer={(triggerNode) => {
                  let xNode = triggerNode.parentNode.parentNode.parentNode;

                  return xNode;
                }}
                showSearch={false}
                {...restControlProps}
              >
                {_.map(source.options, (opt) => (
                  <Select.Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Select.Option>
                ))}
              </YlSelect>
            )
          }
        </AutoSizer>
      </SearchItemWrapper>
    );
  },
  parseValue: function (value, searcherData, { conditions, key, props } = {}) {
    if (_.isArray(value)) {
      value = _.filter(value, (each) => each !== 'nil');
    }

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

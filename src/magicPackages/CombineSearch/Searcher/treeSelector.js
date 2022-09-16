import React from 'react';
import { TreeSelect } from 'antd';
import _ from 'lodash';
import SearchItemWrapper from '../SearchItemWrapper';
import { renderTreeNodeWithTreeData } from '@/magicPackages/utils/treeHelper';

// 未验证 使用的时候需要测试下
export default {
  comp: function (source, props) {
    const { getFieldDecorator } = props.form;
    const { style, treeData, ...restControlProps } = source.controlProps || {};

    let dataSource = source.options || [];

    if (_.isFunction(source.options)) {
      dataSource = source.options();
    }

    let { ...restFieldDecorator } = source.fieldDecorator || {};

    return (
      <SearchItemWrapper model={source} key={source.id}>
        {getFieldDecorator(source.id, { ...restFieldDecorator })(
          <TreeSelect
            // showSearch
            getPopupContainer={(node) => node.parentNode}
            style={{ width: '100%', ...style }}
            dropdownStyle={{ maxHeight: 300, overflow: 'auto', maxWidth: 400 }}
            placeholder="请选择"
            allowClear
            treeDataSimpleMode
            treeData={dataSource || []}
            treeNodeFilterProp="title"
            {...restControlProps}
          ></TreeSelect>
        )}
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

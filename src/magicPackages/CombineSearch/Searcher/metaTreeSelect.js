import React from 'react';
import { TreeSelect } from 'antd';
import _ from 'lodash';
import SearchItemWrapper from '../SearchItemWrapper';
import { renderTreeNodeWithTreeData } from '@/magicPackages/utils/treeHelper';
import MetaTreeSelect from '../components/MetaTreeSelect';

// 未验证 使用的时候需要测试下
export default {
  comp: function (source, props) {
    const { getFieldDecorator } = props.form;
    const { treeData, ...restControlProps } = source.controlProps || {};
    restControlProps.idKey = restControlProps.idKey || 'id';
    restControlProps.titleKey = restControlProps.titleKey || 'title';

    let dataSource = source.options || [];

    if (_.isFunction(source.options)) {
      dataSource = source.options();
    }
    source.fieldDecorator = source.fieldDecorator || {};

    source.fieldDecorator.getValueFromEvent = (x, y) => {
      if (!x) {
        return x;
      }

      return x.filter((item) => String(item.value).indexOf('_') == 0);
    };

    let { ...restFieldDecorator } = source.fieldDecorator || {};

    return (
      <SearchItemWrapper model={source} key={source.id}>
        {getFieldDecorator(source.id, { ...restFieldDecorator })(
          <MetaTreeSelect {...restControlProps}></MetaTreeSelect>
        )}
      </SearchItemWrapper>
    );
  },
  parseValue: function (value, searcherData, { conditions, key, props } = {}) {
    if (_.isArray(value)) {
      value = _.filter(value, (each) => each !== 'nil');
    }
    if (_.isEmpty(value)) {
      return value;
    }

    let ret = value
      .filter((item) => String(item.value).indexOf('_') == 0)
      .map((item) => item.value.replace('_', ''));

    if (_.isFunction(searcherData.convertToSearchFormat)) {
      return searcherData.convertToSearchFormat(ret, {
        conditions,
        key,
        props
      });
    }

    return ret;
  }
};

import React from 'react';
import defaultEditor from './defaultEditor';
import { Select } from 'antd';
import _ from 'lodash';

export default function (source, props) {
  source.control = Select;
  source.controlProps = {
    placeholder: '请选择',
    allowClear: true,
    getPopupContainer: (node) => node,
    ...source.controlProps
  };

  if (
    source.options &&
    !_.isFunction(source.renderChildren) &&
    !source.controlProps.children
  ) {
    let xOptions = [];

    if (_.isFunction(source.options)) {
      xOptions = [...source.options({ source, props })];
    } else if (_.isArray(source.options)) {
      xOptions = [source.options].map((item) => ({
        key: item.key || item.value,
        value: item.key || item.value,
        label: item.label
      }));
    } else {
      xOptions = source.options;
    }

    const xValues = xOptions.map((each) => each.key);

    if (_.isArray(xOptions) && !_.isEmpty(xOptions)) {
      if (source.hasSelectAll) {
        xOptions.unshift({
          label: '全部',
          key: 'nil'
        });

        source.controlProps = source.controlProps || {};
        source.fieldDecorator = source.fieldDecorator || {};
        source.controlProps.mode = 'multiple';
        source.fieldDecorator.getValueFromEvent = (values) => {
          let prvValue = props.form.getFieldsValue()[source.id];
          if (!_.isArray(prvValue)) {
            prvValue = prvValue ? [prvValue] : [];
          }

          const newAddVal = _.xor(values, prvValue);

          let newVal = values;
          // 如果是添加新项
          if (values.length > prvValue.length) {
            // 如果点击的是全部 则选择所有
            if (newAddVal.indexOf('nil') >= 0) {
              let realVal = _.filter(values, (each) => each !== 'nil') || [];
              // 反选
              if (realVal.length === xValues.length) {
                newVal = [];
              } else {
                // 全选
                newVal = xValues.concat(['nil']);
              }
            } else {
              newVal = _.filter(values, (each) => each !== 'nil');

              // 如果已经全选 则添加上 ‘全部’
              if (xValues.length === _.get(newVal, 'length', 0)) {
                newVal.push('nil');
              }
            }
          } else {
            // 如果是反选 则移除全部

            // 如果点击的是全部 则清空所有
            if (newAddVal.indexOf('nil') >= 0) {
              newVal = [];
            } else {
              newVal = _.filter(values, (each) => each !== 'nil');
            }
          }

          // return newVal;
          return _.filter(newVal, (each) => each !== 'nil');
        };
      }
      source.controlProps.children = [...xOptions].map((each) => (
        <Select.Option dataref={each} key={each.key} value={each.key}>
          {each.label}
        </Select.Option>
      ));
    }
  }

  if (source.required) {
    source.fieldDecorator = source.fieldDecorator || {};
    source.fieldDecorator.rules = source.fieldDecorator.rules || [];
    let xRules = _.get(source, 'fieldDecorator.rules') || [];

    if (!xRules.find((each) => each.required)) {
      source.fieldDecorator.rules.push({
        required: true,
        message:
          '请选择' +
          (_.isFunction(source.label)
            ? source.label({ source, props })
            : source.label)
      });
    }
  }

  if (!_.isFunction(source.convertControlToModel)) {
    source.convertControlToModel = (val, { source, props, conditions }) => {
      // null unddefined int strng
      if (_.isEmpty(val) || !_.isArray(val)) {
        return val;
      }
      return (val || []).filter((each) => each !== 'nil');
    };
  }

  if (!_.isFunction(source.convertModelToControl)) {
    source.convertModelToControl = (val, { source, props }) => {
      if (source.controlProps.multiple) {
        if (val == null || val == undefined || _.isEmpty(val)) return undefined;

        return val.filter(
          (item) => item && item.key !== null && item.key !== undefined
        );
      }

      if (val == null || val == undefined) {
        return undefined;
      }

      return val;
    };
  }

  return defaultEditor(source, props);
}

import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import SearchItemWrapper from '../SearchItemWrapper';
import MonthPickerEX from '../components/MonthPickerEx';
export default {
  comp: function (source, props) {
    const { getFieldDecorator } = props.form;

    var fieldDecorator = {
      ...source.fieldDecorator
    };

    return (
      <SearchItemWrapper model={source} key={source.id}>
        {getFieldDecorator(
          source.id,
          fieldDecorator
        )(
          <MonthPickerEX
            allowClear
            {...source.controlProps}
            style={{ width: '100%' }}
          />
        )}
      </SearchItemWrapper>
    );
  },
  parseValue: function (value, searcherData, { conditions, key, props } = {}) {
    if (_.isObject(value) && moment.isMoment(value)) {
      value = value.format(
        _.get(searcherData, 'controlProps.format') || 'YYYY-MM'
      );
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

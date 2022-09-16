import defaultEditor from './defaultEditor';
import { DatePicker } from 'antd';
import _ from 'lodash';
import moment from 'moment';

export default function (source, props) {
  source.control = DatePicker.RangePicker;
  source.controlProps = { ...source.controlProps };
  if (source.options && !source.controlProps.options) {
    source.controlProps.options = [...source.options];
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
      let startKey = source.startKey || 'startTime';
      let endKey = source.endKey || 'endTime';

      let format =
        _.get(source, 'controlProps.format') || 'YYYY-MM-DD HH:mm:ss';

      if (!_.isEmpty(val) && val.length === 2) {
        conditions[startKey] = val[0].format(format);
        conditions[endKey] = val[1].format(format);
      }
      return undefined;
    };
  }

  if (!_.isFunction(source.convertModelToControl)) {
    let startKey = source.startKey || 'startTime';
    let endKey = source.endKey || 'endTime';

    source.convertModelToControl = (val, { source, props }) => {
      let { model } = props || {};

      return model && model[startKey] && model[endKey]
        ? [moment(model[startKey]), moment(model[endKey])]
        : undefined;
    };
  }

  return defaultEditor(source, props);
}

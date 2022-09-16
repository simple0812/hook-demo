import defaultEditor from './defaultEditor';
import { DatePicker } from 'antd';
import _ from 'lodash';
import moment from 'moment';

export default function (source, props) {
  source.control = DatePicker;
  source.controlProps = { placeholder: '请选择时间', ...source.controlProps };
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
      let format =
        _.get(source, 'controlProps.format') || 'YYYY-MM-DD HH:mm:ss';

      if (!moment.isMoment(val)) {
        return undefined;
      }

      return val.format(format);
    };
  }

  if (!_.isFunction(source.convertModelToControl)) {
    source.convertModelToControl = (val, { source, props }) => {
      let { model } = props || {};

      return model && model[source.id] ? moment(model[source.id]) : undefined;
    };
  }

  return defaultEditor(source, props);
}

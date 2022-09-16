import _ from 'lodash';
import ColorPicker from '../components/ColorPicker';
import defaultEditor from './defaultEditor';

export default function (source, props) {
  source.control = ColorPicker;
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
  }

  if (!_.isFunction(source.convertModelToControl)) {
  }

  return defaultEditor(source, props);
}

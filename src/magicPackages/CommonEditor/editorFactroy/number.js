import defaultEditor from './defaultEditor';
import NumberCom from '../components/Number';

import _ from 'lodash';

export default function (source, props) {
  source.control = NumberCom;
  source.controlProps = {
    autoComplete: 'off',
    allowClear: true,
    placeholder:
      source.placeholder ||
      '请输入' +
        (_.isFunction(source.label)
          ? source.label({ source, props })
          : source.label),
    ...source.controlProps
  };

  if (source.required) {
    source.fieldDecorator = source.fieldDecorator || {};
    source.fieldDecorator.rules = source.fieldDecorator.rules || [];
    let xRules = _.get(source, 'fieldDecorator.rules') || [];

    if (!xRules.find((each) => each.required)) {
      source.fieldDecorator.rules.push({
        required: true,
        message:
          '请输入' +
          (_.isFunction(source.label)
            ? source.label({ source, props })
            : source.label)
      });
    }
  }
  return defaultEditor(source, props);
}

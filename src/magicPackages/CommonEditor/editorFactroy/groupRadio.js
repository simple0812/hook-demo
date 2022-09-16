import defaultEditor from './defaultEditor';
import { Radio } from 'antd';
import _ from 'lodash';

export default function (source, props) {
  source.control = Radio.Group;
  source.controlProps = { ...source.controlProps };
  if (source.options && !source.controlProps.options) {
    let xOptions = [];

    if (_.isFunction(source.options)) {
      xOptions = source.options({ source, props }) || [];
    } else {
      xOptions = [...source.options];
    }

    source.controlProps.options = [...xOptions];
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

  return defaultEditor(source, props);
}

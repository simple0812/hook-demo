import defaultEditor from './defaultEditor';
import _ from 'lodash';
import { Checkbox } from 'antd';

export default function (source, props) {
  source.control = Checkbox;
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

  source.fieldDecorator = source.fieldDecorator || {};
  source.fieldDecorator.valuePropName = 'checked';

  return defaultEditor(source, props);
}

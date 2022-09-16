import defaultEditor from './defaultEditor';
import _ from 'lodash';
import { Switch } from 'antd';

export default function (source, props) {
  source.control = Switch;
  source.controlProps = {
    placeholder: source.placeholder,
    ...source.controlProps,
    style: {
      ...source.controlProps?.style,
      width: 45
    }
  };

  source.fieldDecorator = source.fieldDecorator || {};
  source.fieldDecorator.valuePropName = 'checked';

  if (_.isUndefined(source.getInitialValue)) {
    source.getInitialValue = false;
  }

  if (!_.isFunction(source.convertModelToControl)) {
    source.convertModelToControl = (val, { source, props }) => {
      if (_.isUndefined(val)) {
        return val;
      }

      return !!val;
    };
  }

  if (!_.isFunction(source.convertControlToModel)) {
    source.convertControlToModel = (val, { source, props, conditions }) => {
      if (_.isUndefined(val)) {
        return val;
      }
      return val ? 1 : 0;
    };
  }

  return defaultEditor(source, props);
}

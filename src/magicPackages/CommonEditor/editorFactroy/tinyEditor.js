import defaultEditor from './defaultEditor';
import _ from 'lodash';
import TinyEditor from '../components/TinyEditor';

export default function (source, props) {
  source.control = TinyEditor;
  if (!source.colSpan) {
    source.colSpan = 24;
  }
  source.controlProps = {
    ...source.controlProps
  };
  source.formItemProps = {
    ...source.formItemProps,
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      lg: { span: 24 },
      xl: { span: 24 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      lg: { span: 24 },
      xl: { span: 24 }
    }
  };

  if (source.required) {
    source.fieldDecorator = source.fieldDecorator || {};
    source.fieldDecorator.rules = source.fieldDecorator.rules || [];
    let xRules = _.get(source, 'fieldDecorator.rules') || [];

    if (!xRules.find((each) => each.required)) {
      source.fieldDecorator.rules.push({
        required: true,
        message:
          '请填写' +
          (_.isFunction(source.label)
            ? source.label({ source, props })
            : source.label)
      });
    }
  }
  return defaultEditor(source, props);
}

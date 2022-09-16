import _ from 'lodash';
import defaultEditor from './defaultEditor';
import Upload from '../components/Upload/Single';

export default function (source, props) {
  source.control = Upload;
  source.controlProps = {
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
          '请选择' +
          (_.isFunction(source.label)
            ? source.label({ source, props })
            : source.label)
      });
    }
  }
  return defaultEditor(source, props);
}

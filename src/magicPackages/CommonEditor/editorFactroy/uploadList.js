import defaultEditor from './defaultEditor';
import _ from 'lodash';
import Upload from '../components/Upload';

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

  if (!_.isFunction(source.convertControlToModel)) {
    source.convertControlToModel = (val, { source, props, conditions }) => {
      if (!val) {
        return undefined;
      }

      let xVal = val
        .filter((item) => item.status == 'done')
        .map((item) => item.url || item.response);

      return source.isArray ? xVal : xVal.join(',');
    };
  }

  if (!_.isFunction(source.convertModelToControl)) {
    source.convertModelToControl = (val, { source, props }) => {
      if (!val) {
        return val;
      }
      let xVal = val;

      if (_.isString(val)) {
        xVal = val.split(',');
      }
      return xVal.map((item, i) => ({
        uid: item + '_' + i,
        name: item,
        status: 'done',
        url: item
      }));
    };
  }

  return defaultEditor(source, props);
}

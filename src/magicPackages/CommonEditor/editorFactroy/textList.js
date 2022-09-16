import _ from 'lodash';
import defaultEditor from './defaultEditor';
import TextList from '../components/TextList';

export default function (source, props) {
  source.control = TextList;
  source.controlProps = {
    autoComplete: 'off',
    allowClear: true,
    ...source.controlProps
  };

  if (!_.isFunction(source.convertControlToModel)) {
    source.convertControlToModel = (val) => {
      if (_.isEmpty(val) || !_.isArray(val)) {
        return val;
      }
      return (val || [])
        .filter((each) => each !== '' && (each.text || '').trim() != '')
        .map((item) => item.text);
    };
  }

  if (!_.isFunction(source.convertModelToControl)) {
    source.convertModelToControl = (val) => {
      if (val == null || val == undefined || _.isEmpty(val)) {
        return undefined;
      }

      return val.map((item) => ({
        text: item,
        _id: String(Math.random()).slice(2)
      }));
    };
  }

  return defaultEditor(source, props);
}

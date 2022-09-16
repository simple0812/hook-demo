import _ from 'lodash';
import defaultEditor from './defaultEditor';
import GroupTextList from '../components/GroupTextList';

export default function (source, props) {
  source.control = GroupTextList;
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
      return val; //(val || []).filter((each) => each !== '').map((item) => item.text);
    };
  }

  if (!_.isFunction(source.convertModelToControl)) {
    source.convertModelToControl = (val) => {
      if (val == null || val == undefined || _.isEmpty(val) || !val.map) {
        return undefined;
      }

      console.log('**************', val);

      return val.map((item) => ({
        _id: String(Math.random()).slice(2),
        ...item
      }));
    };
  }

  return defaultEditor(source, props);
}

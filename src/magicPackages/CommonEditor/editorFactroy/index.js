/** 编辑有一定的性能问题 大于50个字段需要谨慎使用*/

import _ from 'lodash';
import defaultEditor from './defaultEditor';
import inputEditor from './input';
import select from './select';
import textarea from './textarea';
import checkboxGroup from './groupCheckbox';
import radioGroup from './groupRadio';
import rangePicker from './rangePicker';
import timePicker from './timePicker';
import cascader from './cascader';
import treeSelect from './treeSelect';
import tree from './tree';
import upload from './uploader';
import tinyEditor from './tinyEditor';
import datePicker from './datePicker';
import switcher from './switch';
import checkbox from './checkbox';
import numberCom from './number';
import metaSelect from './metaSelect';
import metaTreeSelect from './metaTreeSelect';
import textList from './textList';
import uploadList from './uploadList';
import label from './label';
import line from './line';
import colorPicker from './colorPicker';
import groupTextList from './groupTextList';

const ctrlList = new Map([
  ['input', inputEditor],
  ['label', label],
  ['line', line],
  ['tree', tree],
  ['metaTreeSelect', metaTreeSelect],
  ['number', numberCom],
  ['textList', textList],
  ['groupTextList', groupTextList],
  ['uploadList', uploadList],
  ['datePicker', datePicker],
  ['select', select],
  ['cascader', cascader],
  ['rangePicker', rangePicker],
  ['timePicker', timePicker],
  ['colorPicker', colorPicker],
  ['textarea', textarea],
  ['checkboxGroup', checkboxGroup],
  ['radioGroup', radioGroup],
  ['treeSelect', treeSelect],
  ['upload', upload],
  ['switch', switcher],
  ['checkbox', checkbox],
  ['tinyEditor', tinyEditor],
  ['metaSelect', metaSelect]
]);

export default (type = 'input') => {
  if (_.isObject(type)) {
    return defaultEditor;
  }

  return ctrlList.get(type) || defaultEditor;
};

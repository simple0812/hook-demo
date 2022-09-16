import _ from 'lodash';
import inputSearcher from './input';
import numberSearcher from './number';
import selectSearcher from './select';
import ylSelectSearcher from './ylSelect';
import datePickerSearcher from './datePicker';
import rangePickerSearcher from './rangePicker';
import rangerNumberSearcher from './rangeNumber';
import customSearcher from './custom';
import monthPicker from './monthPicker';
import cascader from './cascader';
import treeSelectSearcher from './treeSelector';
import metaTreeSelect from './metaTreeSelect';
import metaSelect from './metaSelect';

export default function (type) {
  type = type || 'input';

  if (_.isObject(type)) {
    // type = 'custom';
    return customSearcher;
  }

  const factory = {
    input: inputSearcher,
    number: numberSearcher,
    select: selectSearcher,
    ylSelect: ylSelectSearcher,
    treeSelect: treeSelectSearcher,
    metaTreeSelect,
    datePicker: datePickerSearcher,
    rangePicker: rangePickerSearcher,
    cascader,
    monthPicker,
    rangeNumber: rangerNumberSearcher,
    custom: customSearcher,
    metaSelect
  };

  return factory[type];
}

export {
  inputSearcher,
  numberSearcher,
  selectSearcher,
  ylSelectSearcher,
  datePickerSearcher,
  rangePickerSearcher,
  customSearcher,
  monthPicker
};

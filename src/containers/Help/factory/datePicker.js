import { DatePicker } from 'antd';
import helper from './helper';

import moment from 'moment';

export default function (formItemData) {
  let xData = helper(formItemData, DatePicker);

  // convertModelToView
  if (!xData.addon.convertViewToModel) {
    xData.addon.convertViewToModel = (val, options) => {
      if (val && moment.isMoment(val)) {
        return val.format(formItemData.controlProps.format || 'YYYY-MM-DD');
      }

      return val;
    };
  }

  return xData;
}

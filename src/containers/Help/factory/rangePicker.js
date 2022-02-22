import { DatePicker } from 'antd';
import helper from './helper';

import moment from 'moment';

const RangePicker = DatePicker.RangePicker;

export default function (formItemData) {
  let xData = helper(formItemData, RangePicker);

  if (!xData.addon.convertViewToModel) {
    xData.addon.convertViewToModel = (
      val,
      { form, condition, controlData }
    ) => {
      if (
        val &&
        val.length == 2 &&
        moment.isMoment(val[0]) &&
        moment.isMoment(val[1])
      ) {
        let startKey = 'startTime';
        let endKey = 'endTime';

        if (formItemData && formItemData.startKey && formItemData.endKey) {
          startKey = formItemData.startKey;
          endKey = formItemData.endKey;
        }

        condition[startKey] = val[0].format(
          formItemData.controlProps.format || 'YYYY-MM-DD'
        );
        condition[endKey] = val[1].format(
          formItemData.controlProps.format || 'YYYY-MM-DD'
        );

        return undefined;
      }

      return val;
    };
  }

  return xData;
}

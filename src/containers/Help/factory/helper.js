import _ from 'lodash';

export default function (formItemData, control) {
  let fromItemProps = {
    rules: [...((formItemData.fromItemProps || {}).rules || [])]
  };

  if (
    formItemData.required &&
    !_.find(fromItemProps.rules, (item) => item.required)
  ) {
    let txt = '请选择';
    if (formItemData.control === 'input' || formItemData.control === 'number') {
      txt = '请输入';
    }
    fromItemProps.rules.push({
      required: true,
      message: `${txt}${formItemData.label}`
    });
  }

  let addon = formItemData.addon || {};
  return {
    control: control,
    rawData: formItemData,
    addon,
    fromItemProps,
    controlProps: {
      allowClear: true,
      style: {
        width: '100%',
        ...formItemData.controlProps.style
      }
    }
  };
}

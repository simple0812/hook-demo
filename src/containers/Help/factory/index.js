import input from './input';
import number from './number';
import select from './select';
import rangePicker from './rangePicker';
import datePicker from './datePicker';

export default function (formItemData) {
  let control = null;
  switch (formItemData.control) {
    case 'input':
      control = input(formItemData);
      break;
    case 'number':
      control = number(formItemData);
      break;
    case 'select':
      control = select(formItemData);
      break;
    case 'rangePicker':
      control = rangePicker(formItemData);
      break;
    case 'datePicker':
      control = datePicker(formItemData);
      break;
    default:
      control = input(formItemData);
      break;
  }

  return control;
}

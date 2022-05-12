import ApplyForm from '../components/ApplyForm';
import ShopWindow from '../components/ShopWindow';
export default (type) => {
  let com = null;
  switch (type) {
    case 'applyForm':
      com = ApplyForm;
      break;
    case 'shopWindow':
      com = ShopWindow;
      break;
    default:
      break;
  }

  return com;
};

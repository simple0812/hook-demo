import { notification } from 'antd';
import './index.less';

/**
 * message: 提示信息
 * duration: 提示框显示时长，单位为秒
 * @type {{success: message.success, error: message.error, warning: message.warning}}
 */
const message = {
  success: (message, duration) => {
    notification.open({
      message: '',
      description: message,
      duration: duration || 2,
      className: 'messageSuccess'
    });
  },
  error: (message, duration) => {
    notification.open({
      message: '',
      description: message,
      duration: duration || 2,
      className: 'messageError'
    });
  },
  warning: (message, duration) => {
    notification.open({
      message: '',
      description: message,
      duration: duration || 2,
      className: 'messageWarning'
    });
  }
};

export default message;

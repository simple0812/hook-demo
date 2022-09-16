import React, { Component } from 'react';
import { Icon, Input } from 'antd';
import _ from 'lodash';

class NumberCom extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== prevState.value) {
      prevState.value = nextProps.value;
      return prevState;
    }

    return null;
  }
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (evt) => {
    const { onChange, precision } = this.props;
    let { value } = evt.target;
    value = (value || '').replace('。', '.');
    const reg = /^\d+\.?\d*$/;
    if (value && !value.match(reg)) {
      return;
    }

    // 验证小数精度
    if (!_.isUndefined(precision) && value) {
      if (precision == 0 && String(value).indexOf('.') >= 0) {
        return;
      }
      const arr = String(value).split('.');

      if (arr[1] && arr[1].length > precision) {
        return;
      }
    }

    if (_.isFunction(onChange)) {
      onChange(value);
    } else {
      this.setState({
        value
      });
    }
  };

  render() {
    const { value } = this.state;
    const { value: xval, onChange, ...restProps } = this.props;

    return <Input value={value} onChange={this.handleChange} {...restProps} />;
  }
}

export default NumberCom;

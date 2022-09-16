import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
class MonthPickerEx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  handleOpenChange = (isOpen) => {
    this.setState({
      isOpen
    });
  };

  handleChange = (count) => {
    const { onChange } = this.props;
    if (onChange) {
      let val = moment()
        .startOf('month')
        .subtract(count || 0, 'month');
      onChange(val, val.format('YYYY-MM'));
      this.setState({
        isOpen: false
      });
    }
  };

  render() {
    const { open, onOpenChange, onChange, ...restProps } = this.props;
    return (
      <DatePicker.MonthPicker
        open={this.state.isOpen}
        onChange={onChange}
        onOpenChange={this.handleOpenChange}
        renderExtraFooter={() => {
          return (
            <>
              <span
                style={{ cursor: 'pointer' }}
                onClick={this.handleChange.bind(this, 1)}
              >
                上月
              </span>
              <span
                style={{ cursor: 'pointer', marginLeft: '10px' }}
                onClick={this.handleChange.bind(this, 0)}
              >
                本月
              </span>
            </>
          );
        }}
        {...restProps}
      />
    );
  }
}

export default MonthPickerEx;

import React, { Component } from 'react';
import { Input } from 'antd';

import Icon from '@/components/Icon/AntIcon';

import './index.less';

class SubList extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      if (props.value && props.value.length) {
        return {
          value: props.value
        };
      }
      return {
        value: [
          {
            _id: String(Math.random()).slice(3, 9)
          }
        ]
      };
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      value: [
        {
          _id: String(Math.random()).slice(3, 9)
        }
      ]
    };
  }

  handleChange = (item, key, evt) => {
    const { value = [] } = this.state;
    const { onChange } = this.props;

    if (item) {
      item[key] = evt.target.value;
    }

    if (onChange) {
      onChange(value);
    } else {
      this.setState({
        value
      });
    }
  };

  removeSchedule = (schedule, index) => {
    let { value = [] } = this.state;
    const { onChange } = this.props;
    if (!value) {
      value = [];
    }

    value.splice(index, 1);

    if (onChange) {
      onChange(value);
    } else {
      this.setState({
        value
      });
    }
  };

  addSchedule = () => {
    let { value = [] } = this.state;
    const { onChange } = this.props;
    if (!value) {
      value = [];
    }

    value.push({
      _id: String(Math.random()).slice(3, 9)
    });

    if (onChange) {
      onChange(value);
    } else {
      this.setState({
        value
      });
    }
  };

  render() {
    const { value = [] } = this.state;

    return (
      <div className="subListCom">
        {(value || []).map((schedule, index) => (
          <div className="subListCom-item" key={schedule._id}>
            <Input
              value={schedule.title}
              placeholder="请输入"
              onChange={this.handleChange.bind(this, schedule, 'title')}
            />
            <Input
              value={schedule.des}
              placeholder="请输入"
              onChange={this.handleChange.bind(this, schedule, 'des')}
            />

            {index == 0 ? (
              <Icon
                type="plus"
                className="btn-icon"
                onClick={this.addSchedule}
              />
            ) : (
              <Icon
                type="minus"
                className="btn-icon"
                onClick={this.removeSchedule.bind(this, schedule, index)}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default SubList;

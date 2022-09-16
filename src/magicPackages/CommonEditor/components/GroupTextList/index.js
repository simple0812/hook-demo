import React, { Component } from 'react';
import { Icon, Input } from 'antd';
import SubList from './SubList';

import './index.less';

class GroupTextList extends Component {
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
      item[key] = evt.target ? evt.target.value : evt;
    }

    if (onChange) {
      onChange(value);
    } else {
      this.setState({
        value
      });
    }
  };

  removeGroup = (schedule, index) => {
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

  addGroup = () => {
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
      <div className="groupTextCom">
        {(value || []).map((item, index) => (
          <div key={item._id} className="groupTextCom-group">
            <div className="groupTextCom-item">
              <Input
                value={item.title}
                placeholder="请输入标题"
                onChange={this.handleChange.bind(this, item, 'title')}
              />
              {/* {index == 0 ? (
                <Icon type="plus" className="btn-icon" onClick={this.addGroup} />
              ) : (
                <Icon type="minus" className="btn-icon" onClick={this.removeGroup.bind(this, item, index)} />
              )} */}
            </div>
            <SubList
              value={item.textList}
              onChange={this.handleChange.bind(this, item, 'textList')}
            />
          </div>
        ))}
      </div>
    );
  }
}

export default GroupTextList;

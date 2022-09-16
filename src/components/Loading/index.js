import React, { Component } from 'react';
import { Empty } from 'antd';
import { Icon } from '@ant-design/compatible';
class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { style, isLoading, isEmpty } = this.props;

    if (isLoading) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            color: '#aaa',
            ...style
          }}
        >
          <Icon type="LoadingOutlined" />
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            color: '#aaa',
            ...style
          }}
        >
          <Empty />
        </div>
      );
    }

    return this.props.children;
  }
}

export default Loading;

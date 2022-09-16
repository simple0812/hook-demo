import React, { Component } from 'react';
import { Col } from 'antd';
import _ from 'lodash';

class SearchItemWrapper extends Component {
  render() {
    const { model = {}, children } = this.props;
    let xStyle = {};
    let wrapperStyle = { ...model.wrapperStyle };

    // 如果组件设置定宽 则 需要重置col和wrapper的样式属性
    if (_.get(model, 'controlProps.style.width')) {
      xStyle.width = 'auto';
      wrapperStyle.width = _.get(model, 'controlProps.style.width');
    }

    let colProps = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 8,
      xl: 6,
      xxl: 6
    };

    let windowWidth =
      document.documentElement.clientWidth || document.body.clientWidth;

    if (windowWidth >= 2048) {
      colProps.xxl = 4;
    }

    if (!_.isEmpty(model.colProps)) {
      colProps = model.colProps;
    }

    return (
      <Col
        className="search-item-container"
        {...colProps}
        style={{ ...xStyle }}
      >
        {model.label && (
          <span
            className="search-item-label"
            ref={(ref) => (this.labelRef = ref)}
            style={{ ...model.labelStyle }}
          >
            {model.label}：
          </span>
        )}
        <div className="search-item-control" style={{ ...wrapperStyle }}>
          {children}
        </div>
      </Col>
    );
  }
}

export default SearchItemWrapper;

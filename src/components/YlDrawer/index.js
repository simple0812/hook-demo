import React, { Component } from 'react';
import { Form, Button, Drawer, Row, Upload } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
import _ from 'lodash';
import message from '@/components/message';

class YlDrawer extends Component {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidUpdate(prevProps) {
    const { onShow, visible } = this.props;

    if (prevProps.visible !== visible && visible) {
      if (_.isFunction(onShow)) {
        onShow(visible);
      }
    }
  }

  handelClose = () => {
    const { onClose } = this.props;
    if (_.isFunction(onClose)) {
      onClose();
    }
  };

  render() {
    let {
      style,
      title,
      className,
      visible,
      onClose,
      children,
      renderFooter,
      okText,
      cancelText,
      onOk,
      ...restProps
    } = this.props;

    return (
      <Drawer
        title={title || ''}
        width={1200}
        placement="right"
        maskClosable={false}
        destroyOnClose={true}
        onClose={onClose}
        style={{
          ...style
        }}
        className={classNames(styles.drawerComp, className)}
        visible={!!visible}
        {...restProps}
      >
        <div className="draw-content">{children}</div>
        <div className="draw-footer">
          {_.isFunction(renderFooter) ? (
            renderFooter({ drawerInstance: this })
          ) : (
            <>
              <Button
                onClick={this.handelClose.bind(this, null)}
                style={{ marginRight: 8 }}
              >
                {cancelText || '取消'}
              </Button>
              <Button type="primary" onClick={this.props.onOk}>
                {okText || '确定'}
              </Button>
            </>
          )}
        </div>
      </Drawer>
    );
  }
}

export default YlDrawer;

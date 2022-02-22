import React, { Component } from 'react';
import { Empty } from 'antd';

import styles from './index.less';
class EmptyHolder extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className={styles.emptyHolderCom}>
        <Empty />
      </div>
    );
  }
}

export default EmptyHolder;

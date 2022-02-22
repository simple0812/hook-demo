import React, { Component } from 'react';
import styles from './index.less';
import Debounce from 'lodash-decorators/debounce';
import Options from './Options';
import { Link } from 'react-router-dom';
import logo from '@/assets/img/logo.png';
import logo2 from '@/assets/img/logo2x.png';
import { inject } from 'mobx-react';

@inject('globalStore')
export default class GloabalHeader extends Component {
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  render() {
    const { collapse } = this.props.globalStore;
    return (
      <div
        className={`${styles.header} ${collapse ? styles.headerActive : ''}`}>
        <div className={styles.logo} id="logo">
          <img src={require('@/assets/logo.jpg')} alt="" />
          <Link to="/">
            {<span className={styles.headerTitle}>百安居租赁系统</span>}
          </Link>
        </div>
        <Options />
      </div>
    );
  }
}

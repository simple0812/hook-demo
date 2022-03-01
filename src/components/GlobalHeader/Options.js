import React, { Component } from 'react';
import './index.less';
import { Popover, message } from 'antd';
import AntIcon from '@/components/Icon/AntIcon';
import userLogo from '@/assets/img/user-avatar.jpg';
import morning from '@/assets/img/morning.png';
import morning2x from '@/assets/img/morning2x.png';
import evening from '@/assets/img/evening.png';
import evening2x from '@/assets/img/evening2x.png';
import afternoon from '@/assets/img/afternoon.png';
import afternoon2x from '@/assets/img/afternoon2x.png';
import night from '@/assets/img/night.png';
import night2x from '@/assets/img/night2x.png';

import Debounce from 'lodash-decorators';
import { inject } from 'mobx-react';

const mesasge = {
  morning: {
    img1: morning,
    img2: morning2x,
    text: '上午好'
  },
  afternoon: {
    img1: afternoon,
    img2: afternoon2x,
    text: '下午好'
  },
  night: {
    img1: night,
    img2: night2x,
    text: '晚上好'
  },
  evening: {
    img1: evening,
    img2: evening2x,
    text: '夜深了'
  }
};

@inject('globalStore')
class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  logout = async () => {
    const redirectUrl = localStorage.getItem('redirectUrl') || '/';
    // const res = await this.props.loginStore.logout();
    message.success('退出成功');
    document.cookie = `sessionToken='';expires=-1`;
    localStorage.removeItem('userName');
    localStorage.removeItem('isWhitePermissions');
    window.location.href = redirectUrl;
  };

  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  toggle = () => {
    const { collapse, toggle } = this.props.globalStore;

    toggle(!collapse);
    this.triggerResizeEvent();
  };
  render() {
    const { collapse } = this.props.globalStore;
    let time = new Date().getHours();
    let currentTime = 'evening';
    if (time >= 5 && time < 12) {
      currentTime = 'morning';
    } else if (time >= 12 && time < 17) {
      currentTime = 'afternoon';
    } else if (time >= 17 && time < 22) {
      currentTime = 'night';
    }
    const { img1, img2, text } = mesasge[currentTime];
    const content = (
      <span onClick={this.logout} style={{ cursor: 'pointer' }}>
        <AntIcon type="LoginOutlined" style={{ marginRight: 6 }} />
        退出登录
      </span>
    );

    let xName = '';

    if (localStorage.getItem('userName')) {
      xName = localStorage.getItem('userName');
      xName = xName !== 'undefined' ? xName : '';
    }
    return (
      <div className="optionsContainer">
        <div className="trigger">
          <AntIcon
            style={{ fontSize: 16, color: 'rgba(0,0,0,0.65)' }}
            type={collapse ? 'MenuUnfoldOutlined' : 'MenuFoldOutlined'}
            onClick={this.toggle}
          />
        </div>
        <span className="userContainer">
          <span className="message">
            {/* <img src={img1} srcSet={`${img2} 2x`} alt="" /> */}
            {text}
            <span style={{ marginLeft: '4px' }} title={xName}>
              {xName}
            </span>
          </span>
          <img src={userLogo} alt="" />
          <Popover
            content={content}
            title=""
            trigger="hover"
            placement="bottomRight">
            <AntIcon
              type="DownOutlined"
              style={{ fontSize: 12, color: '#ADB6C2' }}
            />
          </Popover>
        </span>
      </div>
    );
  }
}

export default Options;

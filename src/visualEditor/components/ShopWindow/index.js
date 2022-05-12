import React, { useEffect, Component } from 'react';
import { Input } from 'antd';
import './index.less';

class ShopWindowCom extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="ShopWindowCom">
        <div className="ShopWindowCom-item">1111</div>
        <div className="ShopWindowCom-item">222</div>
        <div className="ShopWindowCom-item">333</div>
        <div className="ShopWindowCom-item">444</div>
        <div className="ShopWindowCom-item">5555</div>
        <div className="ShopWindowCom-item holder"></div>
        <div className="ShopWindowCom-item holder"></div>
        <div className="ShopWindowCom-item holder"></div>
      </div>
    );
  }
}

ShopWindowCom.editData = {
  color: '颜色'
};

export default ShopWindowCom;

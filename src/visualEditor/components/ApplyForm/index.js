import React, { useEffect, Component } from 'react';
import { Input } from 'antd';
import './index.less';

class ApplyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="applyFromCom">
        <div className="applyFromCom-item">
          <span className="applyFromCom-item__label">名称</span>
          <Input className="applyFromCom-item__control" />
        </div>
        <div className="applyFromCom-item">
          <span className="applyFromCom-item__label">手机号</span>
          <Input className="applyFromCom-item__control" />
        </div>
      </div>
    );
  }
}

ApplyForm.editData = {
  foo: 'test'
};

export default ApplyForm;

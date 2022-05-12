import React, { useEffect, Component } from 'react';
import cn from 'classnames';
import { Input } from 'antd';
import './index.less';

class VisualMaskCom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: '' // 选中的组件
    };
  }

  render() {
    const { onSelect, id, selectedId } = this.props;
    let isActive = id && selectedId === id;
    return (
      <div
        className={cn('visualMaskCom ve-dragnode', {
          actived: isActive
        })}
        id={id}
        draggable={isActive}
        onClick={() => {
          if (onSelect) {
            onSelect(id);
          }
        }}>
        {this.props.children}
        <div className="visualMaskCom-mask"></div>
        <div className="visualMaskCom-border"></div>
      </div>
    );
  }
}

export default VisualMaskCom;

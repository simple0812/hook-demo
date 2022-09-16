import React, { Component } from 'react';
import cn from 'classnames';
import styles from './index.less';

class TileCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { style, title, className, active, onClick } = this.props;
    return (
      <div
        onClick={onClick}
        className={cn(styles.tileCardCom, className, {
          [styles.active]: active
        })}
        style={style}
      >
        <div className="img-container">{this.props.children}</div>
        <div className="tile-title yl_ellipsis" title={title || ''}>
          {title || ''}
        </div>
      </div>
    );
  }
}

export default TileCard;

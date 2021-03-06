import React, { createElement } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import './index.less';

class Exception extends React.PureComponent {
  static defaultProps = {
    redirect: '/portal'
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      className,
      backText,
      linkElement = 'a',
      title,
      desc,
      redirect,
      children
    } = this.props;
    return (
      <div className="exception">
        <div className="imgBlock">
          <div className="imgEle">{children}</div>
        </div>
        <div className="content">
          <h1>{title}</h1>
          <div className="desc">{desc}</div>
          {/* <div className={styles.actions}>
            {createElement(
                linkElement,
                {
                  to: redirect,
                  href: redirect,
                },
                <Button type="primary">{backText}</Button>
              )}
          </div> */}
        </div>
      </div>
    );
  }
}

export default Exception;

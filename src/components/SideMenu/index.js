import React, { Component } from 'react';
import SideMenu from './SideMenu';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { routers, routeMap, onCollapse, collapsed } = this.props;
    return (
      <SideMenu
        onCollapse={onCollapse}
        collapsed={collapsed}
        routers={routers}
        routeMap={routeMap}
      />
    );
  }
}

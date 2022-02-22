import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import styles from './index.less';
import { Icon } from '@ant-design/compatible';

const { SubMenu } = Menu;
const { Sider } = Layout;

const getIcon = (icon, theme) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} theme={theme || ''} />;
  }
  return icon;
};

export default class SideMenu extends Component {
  createItem = (list) => {
    return list.map((item, key) => {
      return (
        <Menu.Item key={item.path}>
          <Link to={item.path}>{item.label}</Link>
        </Menu.Item>
      );
    });
  };

  menu(path) {
    this.props.update(path);
  }

  render() {
    const { routers, routeMap, collapsed } = this.props;
    let pathname = window.location.pathname;
    const menuKey = Object.keys(routeMap).find((key) => {
      const reg = new RegExp(`${key}.*`);
      return reg.test(pathname);
    });
    if (menuKey) {
      const menuReg = menuKey.split('').reverse().join('');
      const reg = new RegExp(`.*(?=${menuReg})`);
      pathname = pathname
        .split('')
        .reverse()
        .join('')
        .replace(reg, '')
        .split('')
        .reverse()
        .join('');
    }

    const curRoute = routeMap[pathname] || [];

    const route = curRoute.find((item) => item.path) || {};
    const { superKey = '' } = route;
    // console.log('xxx', routers);
    return (
      <Sider
        className={styles.sider}
        trigger={null}
        id="bnq_menu_side"
        width={208}
        collapsible
        collapsed={collapsed}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={[superKey]}>
          {routers.map((item, key) => {
            const { children = [], show = true } = item;
            if (show) {
              if (children.length > 0) {
                return (
                  <SubMenu
                    key={item.key}
                    title={
                      <span>
                        {getIcon(item.icon, item.theme)}
                        {!collapsed ? item.label : ''}
                      </span>
                    }>
                    {this.createItem(children)}
                  </SubMenu>
                );
              }
              return (
                <Menu.Item key={item.path}>
                  <Link to={item.path}>
                    {getIcon(item.icon, item.theme)}
                    <span>{item.label}</span>
                  </Link>
                </Menu.Item>
              );
            }
            return undefined;
          })}
        </Menu>
      </Sider>
    );
  }
}

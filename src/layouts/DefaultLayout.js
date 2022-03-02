import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { getRouterData } from '@/router';
import SideMenu from '@/components/SideMenu';
import GlobalHeader from '@/components/GlobalHeader';
import { Layout, Menu, Breadcrumb } from 'antd';
import './index.less';

const { Header, Content, Sider, Footer } = Layout;
const SubMenu = Menu.SubMenu;

@inject('globalStore')
@observer
export default class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      route: [
        {
          label: '概览'
        }
      ]
    };
    this.getBreadcrumbNameMap = memoizeOne(
      this.getBreadcrumbNameMap,
      _.isEqual
    );
    this.getMenuData = memoizeOne(this.getMenuData, _.isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getLayoutStyle() {
    const { collapsed } = this.props;
    return {
      paddingLeft: collapsed ? '80px' : '256px'
    };
  }
  
  getMenuData() {
    const routes = getRouterData();
    const addKey = (obj, superKey = '') => {
      if (obj.length === 0) {
        return;
      }
      obj.forEach((item) => {
        const { key = _.uniqueId('key_'), children = [] } = item;
        item.key = key;
        item.superKey = superKey;
        addKey(children, key);
      });
    };
    addKey(routes);
    return routes;
  }
  getBreadcrumbNameMap() {
    const routerMap = {};
    let superNode = {};
    const mergeMenuAndRouter = (data) => {
      data.forEach((menuItem) => {
        const { label, path = '' } = menuItem;
        if (menuItem.children) {
          superNode.label = label;
          superNode.path = path;
          mergeMenuAndRouter(menuItem.children);
          superNode = {};
          return;
        }
        routerMap[menuItem.path] = _.isEmpty(superNode)
          ? [menuItem]
          : [superNode, menuItem];
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  getDefaultPath() {
    const routers = this.getMenuData();
    const getPath = (routers = []) => {
      for (let i = 0; i < routers.length; i++) {
        const route = routers[i];
        if (_.has(route, 'path')) {
          return route['path'];
        } else {
          const children = route.children || [];
          return getPath(children);
        }
      }
    };
    let pathname = getPath(routers);
    return pathname;
  }

  render() {
    const routers = this.getMenuData();
    const collapse = this.props.globalStore?.collapse;

    return (
      <Layout theme="dark">
        <GlobalHeader onCollapse={this.props.globalStore.toggle} />

        <Layout className="basicLayout">
          <SideMenu
            routers={routers}
            routeMap={this.breadcrumbNameMap}
            collapsed={collapse}
            onCollapse={this.props.globalStore.toggle}
          />
          <Layout className="contentLayout">
            <Content className="content">{this.props.children}</Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

import DefaultLayout from '@/layouts/DefaultLayout';
import { Route, Navigate } from 'react-router-dom';
import pageConfig from './componentConfig';

import routerConfig from './config.js';

import _ from 'lodash';
import Exception404 from '@/containers/Exception/404';
import Exception403 from '@/containers/Exception/403';
import Exception500 from '@/containers/Exception/500';
let menuData = routerConfig.menus;
let subPages = routerConfig.subPages;

export function renderByLayout(Com) {
  return (
    <DefaultLayout>
      <Com />
    </DefaultLayout>
  );
}

function getDefaultPath() {
  const routers = generateMenu(menuData);
  const getPath = (routers = []) => {
    if (_.isEmpty(routers)) {
      return '';
    }
    for (let i = 0; i < routers.length; i++) {
      const route = routers[i];
      if (_.has(route, 'path')) {
        return route['path'];
      }
      if (route.children) {
        const children = route.children || [];
        return getPath(children);
      }
    }
  };
  let pathname = getPath(routers);
  return pathname;
}

function getRouteList() {
  const rouList = [];
  const createRoute = (routes) => {
    if (Object.prototype.toString.apply(routes) === '[object Array]') {
      routes.forEach((item) => createRoute(item));
    } else if (Object.prototype.toString.apply(routes) === '[object Object]') {
      const { children = [] } = routes;
      if (children.length > 0) {
        createRoute(children);
      } else {
        rouList.push(
          <Route
            key={routes.path}
            path={routes.path}
            exact={routes.exact}
            // component={routes.render}
            element={renderByLayout(routes.render)}
          />
        );
      }
    }
  };
  // 生成菜单的路由
  createRoute(generateMenu(menuData));
  // 生成其他子页面路由
  createRoute(generateMenu(subPages));
  return rouList;
}

/**
 * 路由由2部分组成 一部分是侧边导航栏 一部分是其他路由（如详情页等）
 *
 */
export function renderRouter() {
  let xRouList = getRouteList();

  return (
    <>
      {xRouList}
      <Route path="/403" element={renderByLayout(Exception403)} />
      <Route path="/404" element={<Exception404 />} />
      <Route path="/500" element={<Exception500 />} />
      <Route
        path="*"
        element={<Navigate to={getDefaultPath()} replace={false} />}
      />
    </>
  );
}

const createMenuItem = (label, path, exact, key, icon, order, theme) => {
  let component = pageConfig[key] || null;
  if (!component) {
    component = pageConfig['exception404'];
  }
  const menuItem = {
    label,
    path,
    exact,
    key,
    icon,
    render: component.default,
    range: order,
    theme
  };
  return menuItem;
};

const generateMenu = (menus = []) => {
  const menuItems = [];
  menus.forEach((item) => {
    const {
      menuName = '',
      menuUrl = '',
      menuKey = '',
      menuIcon = 'dashboard',
      menuType = 'page',
      menuOrder = 0,
      theme = '',
      children = []
    } = item;
    if (menuType === 'folder' && children.length > 0) {
      const menuFolders = {
        label: menuName,
        key: menuKey,
        icon: menuIcon,
        theme,
        range: menuOrder,
        children: generateMenu(children)
      };
      menuItems.push(menuFolders);
    } else if (menuType === 'page') {
      const menuItem = createMenuItem(
        menuName,
        menuUrl,
        true,
        menuKey,
        menuIcon,
        menuOrder,
        theme
      );
      menuItems.push(menuItem);
    } else if (menuType === 'other') {
    }
  });
  return menuItems.sort((a, b) => a.range - b.range);
};

export const getRouterData = () => {
  return generateMenu(menuData);
};

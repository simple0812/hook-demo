import DefaultLayout from '@/layouts/DefaultLayout';
import { Route, Navigate } from 'react-router-dom';
import pageConfig from './componentConfig';

import routerConfig from './config.js';

import Help from '@/containers/Help';
import Foo from '@/containers/Foo';
import Bar from '@/containers/Bar';
import Exception404 from '@/containers/Exception/404';
import Exception403 from '@/containers/Exception/403';
import Exception500 from '@/containers/Exception/500';
let menuData = routerConfig.menus;

export function renderByLayout(Com) {
  return (
    <DefaultLayout>
      <Com />
    </DefaultLayout>
  );
}

/**
 * 路由由2部分组成 一部分是侧边导航栏 一部分是其他路由（如详情页等）
 *
 */
export function renderRouter() {
  return (
    <>
      <Route path="/home" element={renderByLayout(Help)} />
      <Route path="/foo" element={renderByLayout(Foo)} />
      <Route path="/bar" element={renderByLayout(Bar)} />
      <Route path="/403" element={renderByLayout(Exception403)} />
      <Route path="/404" element={<Exception404 />} />
      <Route path="/500" element={<Exception500 />} />
      <Route path="*" element={<Navigate to="/home" replace={false} />} />
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

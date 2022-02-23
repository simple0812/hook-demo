import React from 'react';
import menuData from './menuConfig.json';
import pageConfig, { BlankComponentsConfig } from './ComponentConfig';
import BasicLayout from '../layouts/BasicLayout';
import FullScreenLayout from '../layouts/FullScreenLayout';
let isWhitePermissions = +localStorage.getItem('isWhitePermissions');

let menus = menuData || [];

if (!isWhitePermissions) {
  menus = menus.filter((each) => {
    return each.menuUrl != '/foreman/whitelist';
  });
}

/**
 * 创建菜单项
 * @param {*} label 名称
 * @param {*} path 路由path
 * @param {*} exact
 * @param {*} key
 * @param {*} order 顺序
 */
const createMenuItem = (label, path, exact, key, icon, order, theme) => {
  let component = pageConfig[key] || null;

  // console.log('component', component);
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

const btnsAuthority = {};

/**
 * 创建页面按扭权限
 * @param {*} pageKey
 * @param {*} authorities
 */
const createBtnAuthority = (pageKey, authorities) => {
  btnsAuthority[pageKey] = {};
  authorities.forEach((_item) => {
    btnsAuthority[pageKey][_item.menuKey] = Object.assign({}, _item);
  });
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
      if (children.length > 0) {
        createBtnAuthority(menuKey, children);
      }
    } else if (menuType === 'other') {
      if (children.length > 0) {
        createBtnAuthority(menuKey, children);
      }
    }
  });
  return menuItems.sort((a, b) => a.range - b.range);
};

const baseMenu = generateMenu(menus);
window.btnsAuthority = btnsAuthority;

const getBlankMenu = (menus = []) => {
  let tempMenus = [];
  menus.forEach((item) => {
    let obj = {
      label: item.label,
      path: item.path,
      exact: true,
      render: pageConfig[item.key].default,
      key: item.key,
      parentKey: item.parentKey,
      templateKey: item.templateKey
    };
    tempMenus.push(obj);
  });
  return tempMenus;
};

const blankMenu = getBlankMenu(BlankComponentsConfig);

const routers = [
  {
    label: '创建工单',
    key: 'fullScreen',
    path: '/full',
    exact: false,
    render: FullScreenLayout,
    children: blankMenu
  },
  {
    label: '在线客服',
    path: '/',
    exact: false,
    render: BasicLayout,
    key: 'basic',
    children: baseMenu
  }
];

export const getSubKeys = () => {
  const keys = Object.keys(routers);
  return keys.map((item) => {
    const router = routers[item] || {};
    const { label, icon } = router;

    return { key: item, label, icon };
  });
};

export const getLayoutData = () => {
  const layouts = routers.map((item) => {
    const { path, exact, label, render } = item;
    return {
      path,
      exact,
      label,
      render
    };
  });
  return layouts;
};

// 获取路由
export const getRouterData = (app) => {
  const route = routers.find((item) => item.key === app);
  return route;
};

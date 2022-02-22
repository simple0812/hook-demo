import { Route, Routes } from 'react-router-dom';
import React from 'react';
import DocumentTitle from 'react-document-title';
// import { ContainerQuery } from 'react-container-query';
import _ from 'lodash';
import { getRouterData } from '@/router';
import { Layout } from 'antd';
import Exception403 from '@/containers/Exception/403';
import classNames from 'classnames';
import Exception404 from '@/containers/Exception/404';
import styles from './layout.less';
const { Content } = Layout;

// export const getPageTemplateRole = (pageKey) => {
//   if (
//     pageKey === null ||
//     pageKey === undefined ||
//     !PageTemplateRole.hasOwnProperty(pageKey)
//   ) {
//     return null;
//   }
//   return PageTemplateRole[pageKey];
// };

const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599
  },
  'screen-xxl': {
    minWidth: 1600
  }
};

export default class FullScreenLayout extends React.Component {
  constructor(props) {
    super(props);
    this.btnAuthority = window.btnAuthority || {};
    this.state = {
      routers: getRouterData('fullScreen').children
    };
  }
  getRouteList() {
    const rouList = [];
    const createRoute = (routes) => {
      if (Object.prototype.toString.apply(routes) === '[object Array]') {
        routes.forEach((item) => createRoute(item));
      } else if (
        Object.prototype.toString.apply(routes) === '[object Object]'
      ) {
        const { children = [] } = routes;
        if (children.length > 0) {
          createRoute(children);
        } else {
          const RouterComponent = routes.render;
          // const authority = this.btnAuthority[routes.key]
          const authority = this.btnAuthority[routes.parentKey];
          // const templateRole = getPageTemplateRole(routes.templateKey);
          rouList.push(
            <Route
              key={routes.key}
              menuKey={routes.key}
              path={routes.path}
              exact={routes.exact}
              render={(routeProps) => (
                <RouterComponent
                  pageKey={routes.key}
                  templateRole={null}
                  authority={authority}
                  {...routeProps}
                />
              )}
            />
          );
        }
      }
    };
    const { routers } = this.state;
    createRoute(routers);
    return rouList;
  }
  getPageTitle() {
    let pathname = window.location.hash.substr(1);
    const { routers } = this.state;
    const currentRoute = routers.find((item) => item.path === pathname) || {};
    const { label = '百安居租赁系统' } = currentRoute;
    return label;
  }

  render() {
    const rouList = this.getRouteList();
    console.log('FullScreenLayout');

    const layout = (
      <Layout className={styles.contentLayout}>
        <Content className={styles.content}>
          <Routes>
            {rouList}
            <Route path="*">
              <Exception404 />
            </Route>
          </Routes>
        </Content>
      </Layout>
    );
    const noMenus = <Exception403 />;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div>
          {(params) => (
            <div className={classNames(params)}>
              {rouList.length > 0 ? layout : noMenus}
            </div>
          )}
        </div>
      </DocumentTitle>
    );
  }
}

export default {
  // 侧边导航栏
  menus: [
    {
      id: 2,
      menuName: '场地管理',
      menuUrl: '/',
      menuKey: 'site',
      menuIcon: 'DashboardOutlined',
      menuType: 'folder',
      menuOrder: 1,
      children: [
        {
          id: 1,
          menuName: '物业地查询',
          menuUrl: '/foo',
          menuKey: 'foo',
          menuIcon: '',
          menuType: 'page',
          menuOrder: 1,
          extraInfo: {}
        },
        {
          id: 2,
          menuName: '物业地查询',
          menuUrl: '/bar',
          menuKey: 'bar',
          menuIcon: '',
          menuType: 'page',
          menuOrder: 1,
          extraInfo: {}
        }
      ]
    }
  ],
  routes: []
};

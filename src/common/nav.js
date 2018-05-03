import dynamic from 'dva/dynamic';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [

  // 导航栏页面
  {
    // for admin
    component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页', // for breadcrumb
    path: '/',
    children: [
      {
        name: '个人中心',
        icon: 'home',
        path: 'me',
        component: dynamicWrapper(app, ['me'], () => import('../routes/Me/Me')),
      },
      {
        name: '用户管理',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '开发者管理',
            path: 'developer-manage',
            component: dynamicWrapper(app, ['developer'], () => import('../routes/Developer/Manage')),
          },
          {
            name: '开发者管理',
            path: 'developer-app-manage',
            isHide: true,
            children: [{
              name: '应用管理',
              path: ':id',
              component: dynamicWrapper(app, ['developer'], () => import('../routes/Developer/ManageApp')),
            }, {
              name: '应用管理',
              path: 'profile',
              isHide: true,
              children: [{
                name: '应用详情',
                path: ':id',
                component: dynamicWrapper(app, ['developer'], () => import('../routes/Developer/Profile')),
              }],
            }],
          },
          {
            name: '开发者管理',
            path: 'developer-app-monitor',
            isHide: true,
            children: [{
              name: '监控图表',
              path: ':id',
              component: dynamicWrapper(app, ['developer'], () => import('../routes/Developer/Monitor')),
            }],
          },
          {
            name: '内部人员管理',
            path: 'admin-manage',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
        ],
      },
      {
        name: '能力管理',
        icon: 'api',
        path: 'ability',
        children: [
          {
            name: '新增能力',
            path: 'ability-creation',
            component: dynamicWrapper(app, ['ability', 'model'], () => import('../routes/Ability/Creation')),
          },
          {
            name: '能力列表',
            path: 'ability-manage',
            component: dynamicWrapper(app, ['ability'], () => import('../routes/Ability/Manage')),
          },
          {
            name: '能力列表',
            path: 'ability-profile',
            isHide: true,
            children: [{
              name: '能力详情',
              path: ':id',
              component: dynamicWrapper(app, ['ability', 'model'], () => import('../routes/Ability/Profile')),
            }],
          },
        ],
      },
      {
        name: '模型管理',
        icon: 'folder',
        path: 'model',
        component: dynamicWrapper(app, ['model'], () => import('../routes/Model/Manage')),
      },
      {
        name: '日志管理',
        icon: 'calendar',
        path: 'log',
        children: [
          {
            name: '平台日志',
            path: 'platform',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
          {
            name: '服务器日志',
            path: 'server',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
          {
            name: '数据库日志',
            path: 'database',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
          {
            name: '中间件日志',
            path: 'middleware',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
          {
            name: '硬件日志',
            path: 'hardware',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
          {
            name: '网络日志',
            path: 'network',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
        ],
      },
      {
        name: '集群监控',
        icon: 'laptop',
        path: 'cluster',
        component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
      },
      {
        name: '系统配置',
        icon: 'setting',
        path: 'setting',
        component: dynamicWrapper(app, ['setting'], () => import('../routes/Setting/Setting')),
      },
      {
        path: 'exception',
        children: [
          {
            path: '403',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
          },
          {
            path: '404',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
          },
          {
            path: '500',
            component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
          },
        ],
      },
      // {
      //   // name: '开发者',
      //   path: 'developer',
      //   isHide: true,
      //   children: [
      //     {
      //       path: 'app',
      //       children: [{
      //         name: '开发者应用管理',
      //         path: ':id',
      //         component: dynamicWrapper(app, ['developer'], () => import('../routes/Developer/ManageApp')),
      //       }],
      //     },
      //     {
      //       path: 'profile',
      //       children: [{
      //         name: '应用详情',
      //         path: ':id',
      //         component: dynamicWrapper(app, ['developer'], () => import('../routes/Developer/Profile')),
      //       }],
      //     },
      //   ],
      // },
    ],
  },

  // 首页（登录、注册、注册成功、找回密码）
  {
    component: dynamicWrapper(app, [], () => import('../layouts/IndexLayout')),
    path: '/',
    layout: 'IndexLayout',
    children: [
      {
        path: 'index',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/Index/Login')),
          },
          {
            name: '注册',
            path: 'register',
            component: dynamicWrapper(app, ['register'], () => import('../routes/Index/Register')),
          },
          {
            name: '注册结果',
            path: 'register-result',
            component: dynamicWrapper(app, [], () => import('../routes/Index/RegisterResult')),
          },
          {
            name: '忘记密码',
            path: 'retrieve-password',
            component: dynamicWrapper(app, ['retrieve'], () => import('../routes/Index/RetrievePassword')),
            children: [
              {
                path: 'verify',
                component: dynamicWrapper(app, ['retrieve'], () => import('../routes/Index/RetrievePassword/VerifyStep1')),
              },
              {
                path: 'reset',
                component: dynamicWrapper(app, ['retrieve'], () => import('../routes/Index/RetrievePassword/ResetStep2')),
              },
              {
                path: 'result',
                component: dynamicWrapper(app, ['retrieve'], () => import('../routes/Index/RetrievePassword/ResultStep3')),
              },
            ],
          },
        ],
      },
    ],
  },
];

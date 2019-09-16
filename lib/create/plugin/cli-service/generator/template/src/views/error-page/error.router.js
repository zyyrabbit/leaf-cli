export default [
  {
    path: '/error/404',
    name: '404',
    component: () => import('./error.vue'),
    meta: {
      title: '404',
      type: '404',
      message: '抱歉，您访问的页面不存在'
    },
  },
  {
    path: '/error/500',
    name: '500',
    component: () => import('./error.vue'),
    meta: {
      title: '500',
      type: '500',
      message: '抱歉，服务器出错了'
    },
  },
  {
    path: '/error/403',
    name: '403',
    component: () => import('./error.vue'),
    meta: {
      title: '403',
      type: '403',
      message: '抱歉，您无权访问的该页面'
    },
  }
];

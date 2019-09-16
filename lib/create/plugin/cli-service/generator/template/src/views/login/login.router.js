export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('./index.vue'),
    meta: {
      title: '登录页面',
      layout: 'login'
    },
  }
];

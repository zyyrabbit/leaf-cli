export default [
  {
    path: '/index',
    name: 'index',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '首页',
      pin: true,
      noAuth: true
    },
  },
];

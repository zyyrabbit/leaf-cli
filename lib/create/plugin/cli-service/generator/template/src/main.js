import App from '@leafs/app';
import data from '@/mocks/data';
import httpConfig from './htttpConfig';
// 入口文件
new App({
  theme: 'default',
  beforeCreate: app => {
    app.http.config(httpConfig);
  },
  // 异步获取菜单数据
  getData: async app => {
    return {
      menus: data.menus
    }
  }
}).run('#app');


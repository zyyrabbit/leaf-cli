### store module，会被自动注册

样例

文件名称

```
 menu.module.(ts|js)
```
文件内容

```
const state = {
  menuData: []
};

const getters = {
  menuData: (state) => state.menuData
};

const actions = {};

const mutations = {
  setMenuData(state, menuData) {
    state.menuData = menuData;
  }
};

export default {
  namespaced: true, // 推荐使用 store 模块模式
  state,
  getters,
  actions,
  mutations
};

```
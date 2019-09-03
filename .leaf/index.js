
export default function getDeps() {
    // reuqire.context 可以解决文件夹不存在，也不报错的问题

    const indexScss = require.context('@', true, /assets\/style\/index\.scss$/);
    indexScss._keys = indexScss.keys().filter(v => v === './assets/style/index.scss');

    const logo = require.context('@', true, /assets\/img\/logo\.(svg|png|jpg)$/);
    logo._keys = logo.keys().filter(v => /^\.\/assets\/img\/logo.(svg|png|jpg)$/.test(v));
    
    // 自动加载svg
    const extSvgs = require.context('@', true, /assets\/svg\/.*\.svg$/);
    extSvgs._keys = extSvgs.keys().filter(v => {
      return /^\.\/assets\/svg\/.*\.svg$/.test(v);
    });

    // 自动加载util, 如果文件名带下划线，则不提取
    const extutil = require.context('@', true, /utils\/[^_][^\/]*\.(ts|js)$/);
    extutil._keys = extutil.keys().filter(v => {
      return  /^\.\/utils\/[^_][^\/]*\.(ts|js)$/.test(v);
    });

    // 插入头部item
    const headerItem = require.context('@', true, /components\/_HeaderItems\.vue$/);
    
    headerItem._keys = headerItem.keys().filter(v => v === './components/_HeaderItems.vue');

    // 自动加载全局指令
    const extComps = require.context('@', true, /components\/[^_][^\/]*\.vue$/);
    
    extComps._keys = extComps.keys().filter(v => {
      return /^\.\/components\/[^_][^\/]*\.vue$/.test(v)
    });

    // 自动加载全局组件
    const extDirectives = require.context('@', true, /directives\/[^_][^\/]*\.(ts|js)$/);
   
    // 自动加载mixin
    const extMixins = require.context('@', true, /mixins\/[^_][^\/]*\.(ts|js)$/);

    // 自动加载store module
    const module = require.context('@/store/modules', true, /\.module\.(ts|js)$/);

    const routerConfigs = require.context('@/views', true, /\.router\.(ts|js)$/);

    // 引入设置
    const setting  = require.context('@', false, /setting\.(ts|js)$/);

   
    return {
      headerItem,
      module,
      extComps,
      routerConfigs,
      extDirectives,
      extMixins,
      setting,
      indexScss,
      extSvgs,
      extutil,
      logo,
    }

}
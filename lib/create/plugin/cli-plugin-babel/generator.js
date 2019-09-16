/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-11 15:42:35
 * @LastEditTime: 2019-09-15 22:01:41
 * @LastEditors: your name
 */
module.exports = api => {
  api.extendPackage({
    devDependencies: {
      '@vue/cli-plugin-babel': '^3.0.0',
      'babel-plugin-component': '^1.1.1',
    },
    babel: {
      presets: ['@vue/app']
    },
    dependencies: {
     // 'core-js': '^2.6.5'
    }
  })
}

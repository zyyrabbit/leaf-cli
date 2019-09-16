/*
 * @Description: In User Settings Edit
 * @Author: zyyrabbit
 * @Date: 2019-09-10 14:14:37
 * @LastEditTime: 2019-09-15 21:31:09
 * @LastEditors: Please set LastEditors
 */

module.exports = (api, {
  classComponent,
  tsLint,
  convertJsToTs,
}, _) => {

  api.extendPackage({
    devDependencies: {
      typescript: '^3.4.3',
      '@vue/cli-plugin-typescript': '^3.0.0',
    }
  })

  if (classComponent) {
    api.extendPackage({
      dependencies: {
        'vue-class-component': '^7.0.2',
        'vue-property-decorator': '^8.1.0'
      }
    })
  }

  api.render('./template', {
    isTest: false,
    hasMocha: false,
    hasJest: false
  })

  require('./convert')(api, { tsLint, convertJsToTs });

}

/*
 * @Author: zyyrabbit
 * @Date: 2019-09-11 15:42:35
 * @LastEditTime: 2019-09-15 22:02:34
 * @LastEditors: your name
 * @Description: 
 * @输出一段不带属性的自定义信息
 */
module.exports = (api, options) => {
  api.render('./template')

  api.extendPackage({
    scripts: {
      'serve': 'vue-cli-service serve',
      'build': 'vue-cli-service build'
    },
    dependencies: {
      '@leafs/app': '^0.2.x'
    },
    devDependencies: {
      '@vue/cli-service': '^3.0.0',
      'svg-sprite-loader': '^4.1.3',
      'vue-template-compiler': '^2.6.10'
    },
    'postcss': {
      'plugins': {
        'autoprefixer': {}
      }
    },
    browserslist: [
      '> 1%',
      'last 2 versions'
    ]
  })

  if (options.cssPreprocessor) {
    const deps = {
      sass: {
        'node-sass': '^4.9.0',
        'sass-loader': '^7.1.0'
      },
      'node-sass': {
        'node-sass': '^4.9.0',
        'sass-loader': '^7.1.0'
      },
      'dart-sass': {
        sass: '^1.18.0',
        'sass-loader': '^7.1.0'
      },
      less: {
        'less': '^3.0.4',
        'less-loader': '^5.0.0'
      },
      stylus: {
        'stylus': '^0.54.5',
        'stylus-loader': '^3.0.2'
      }
    }

    api.extendPackage({
      devDependencies: deps[options.cssPreprocessor]
    })
  }
}

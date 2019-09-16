/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-11 15:12:23
 * @LastEditTime: 2019-09-15 21:58:26
 * @LastEditors: your name
 */

exports.defaultPreset = {
  useConfigFiles: true,
  cssPreprocessor: true,
  plugins: {
    './plugin/cli-plugin-babel': {},
    './plugin/cli-service': {},
    './plugin/cli-plugin-css': {},
    './plugin/cli-plugin-eslint': {
      config: 'base',
      lintOn: ['save']
    }
  },
}

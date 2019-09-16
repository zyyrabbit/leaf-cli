/*
 * @Author: zyyrabbit
 * @Date: 2019-09-09 10:56:52
 * @LastEditTime: 2019-09-15 22:50:39
 * @LastEditors: your name
 * @Description: 
 * @输出一段不带属性的自定义信息
 */
exports.getPromptModules = () => {
  return [
    'typescript',
  ].map(file => require(`../create/promptModules/${file}`))
}

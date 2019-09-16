/*
 * @Author: zyyrabbit
 * @Date: 2019-09-11 17:31:34
 * @LastEditTime: 2019-09-11 17:31:34
 * @LastEditors: your name
 * @Description: 
 * @输出一段不带属性的自定义信息
 */
const { transforms }= require('../util');

class ConfigTransform {
  constructor (options) {
    this.fileDescriptor = options.file;
  }

  transform (value, files, context) {
    let file = this.getDefaultFile();
    
    const { type, filename } = file;

    const transform = transforms[type];

    let source;
    let existing;

    const content = transform.write({
      source,
      filename,
      context,
      value,
      existing
    });

    return {
      filename,
      content
    };
  }

  getDefaultFile () {
    const [type] = Object.keys(this.fileDescriptor);
    const [filename] = this.fileDescriptor[type];
    return { type, filename };
  }
}

module.exports = ConfigTransform;

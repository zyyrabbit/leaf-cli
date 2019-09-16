
const ejs = require('ejs');
const GeneratorAPI = require('./GeneratorAPI');
const ConfigTransform = require('./ConfigTransform');
const { 
  writeFileTree,
} = require('../util');

const defaultConfigTransforms = {
  babel: new ConfigTransform({
    file: {
      js: ['babel.config.js']
    }
  }),
  postcss: new ConfigTransform({
    file: {
      js: ['postcss.config.js']
    }
  }),
  browserslist: new ConfigTransform({
    file: {
      lines: ['.browserslistrc']
    }
  })
}

const ensureEOL = str => {
  if (str.charAt(str.length - 1) !== '\n') {
    return str + '\n'
  };
  return str;
}

module.exports = class Generator {
  constructor (context, {
    pkg = {},
    plugins = [],
    files = {},
    invoking = false,
  } = {}) {

    this.context = context;
    this.plugins = plugins;
    this.originalPkg = pkg;
    this.invoking = invoking;
    this.pkg = Object.assign({}, pkg);
    this.files = files;
    this.fileMiddlewares = [];
    this.postProcessFilesCbs = [];
    this.depSources = {};
    
    this.allPluginIds = Object.keys(this.pkg.dependencies || {})
      .concat(Object.keys(this.pkg.devDependencies || {}));
  }

  async initPlugins () {
    let rootOptions = {};
    // 执行插件的generates 函数
    for (const plugin of this.plugins) {
      const { id, apply, options } = plugin;
      const api = new GeneratorAPI(id, this, options, rootOptions);
      await apply(api, options, rootOptions, false);
    }
    
  }

  async generate () {

    await this.initPlugins();
    // 修改文件之前保存
    const initialFiles = Object.assign({}, this.files);

    // 提取配置文件到单独文件
    this.extractConfigFiles();

    // 等待解析文件
    await this.resolveFiles();
   
    this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n';

    // 等待写入更新文件
    await writeFileTree(this.context, this.files, initialFiles);
  }

  // 提取配置到单独的文件夹中
  extractConfigFiles () {
    const configTransforms = Object.assign({},
      defaultConfigTransforms
    );
    const extract = key => {
      if (
        configTransforms[key] &&
        this.pkg[key] &&
        !this.originalPkg[key]
      ) {
        const value = this.pkg[key];
        const configTransform = configTransforms[key];
        const res = configTransform.transform(
          value,
          this.files,
          this.context
        );
        const { content, filename } = res;
        this.files[filename] = ensureEOL(content);
        delete this.pkg[key];
      }
    }

    extract('babel');
    extract('postcss');
    extract('browserslist');
    
  }

  async resolveFiles () {
    const files = this.files;
    for (const middleware of this.fileMiddlewares) {
      await middleware(files, ejs.render);
    }

    for (const postProcess of this.postProcessFilesCbs) {
      await postProcess(files);
    }
  }
}
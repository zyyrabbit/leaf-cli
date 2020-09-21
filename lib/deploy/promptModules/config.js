// 基本配置参数
const config = {
  name: {
    type: 'input',
    message: '环境名称',
    default: '',
  },
  script: {
    type: 'input',
    message: '打包命令',
    default: 'npm run build',
  },
  host: {
    type: 'input',
    message: '服务器地址',
    default: '',
    validate: function(input) {
      if (!input) {
        return '服务器地址不能为空';
      }
      return true;
    },
  },
  port: {
    type: 'number',
    message: '服务器端口号',
    validate: function(input) {
      if (typeof input !== 'number' || isNaN(input)) {
        return '请输入正确的服务器端口号';
      }
      return true;
    },
    default: 22,
  },
  dist: {
    type: 'input',
    message: '本地打包目录',
    default: 'dist',
  },
  delpoyDir: {
    type: 'input',
    message: '部署路径',
    validate: function(input) {
      if (!input) {
        return '部署路径不能为空';
      }
      return true;
    },
  }
}
exports.configKeys = () => Object.keys(config);

exports.generatorEnvConfig = (env, over = {}) => {
  let convert = (key, item) => {
    return {
      ...item,
      name: `${env}-${key}`,
      when: (answers) => answers.envs.includes(env),
      ...over[key],
    }
  };
  if (typeof env === 'function') {
    convert = env;
  }
  return exports.configKeys().map((key) => {
    return convert(key, {
      ...config[key],
    });
  });
}



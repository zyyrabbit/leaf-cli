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
  },
  port: {
    type: 'number',
    message: '服务器端口号',
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
  }
}
exports.configKeys = () => Object.keys(config);

exports.generatorEnvConfig = (env) => {
  let convert = (key, item) => {
    return {
      ...item,
      name: `${env}-${key}`,
      when: (answers) => answers.envs.includes(env),
    }
  };
  if (typeof env === 'function') {
    convert = env;
  }
  return exports.configKeys().map((key) => {
    return convert(key, {
      ...config[key]
    });
  });
}



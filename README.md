# leaf-cli

1. 全局安装leaf命令 

```
npm install -g @leafs/cli

```

### 命令

#### 创建管理台项目模板

1. 创建项目

```
leaf create [your project]
```

2. 选择 admin 项目

3. 启动leaf框架

```
leaf start
```

4. 升级leaf框架

```
leaf update
```

#### 创建electron项目

1. 创建项目

```
leaf create [your project]
```

2. 选择 electron 项目模板

3. 启动项目

```
npm run dev
```

4. 打包应用

```
npm run build:demo

```

#### 部署管理台项目

1. 项目根目录下生成配置文件

```
leaf deploy init
```

2. 部署项目

```
leaf deploy <env>
```

env: 环境参数

3. 查询备份tags

```
leaf deploy tag -e <env>
```

env: 环境参数

4. 项目回滚

```
leaf deploy rollback -e <env> -t <tag>
```

env: 环境参数
tag: 标签参数



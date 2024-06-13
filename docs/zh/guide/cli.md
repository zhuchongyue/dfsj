# @dfsj/cli

:::tip
快速构建业务前端的命令行工具
:::

## 模板类型

| **模板类型** | **说明**  |
|:---------|:--------|
| `admin`  | `完整版本`  |
| `thin`   | `精简版本`  |
| `mobile` | `移动端版本` |

## 目录

```shell
template
├── build (构建)
│   ├── generate
│   │   └── icon
│   ├── script
│   │   ├── buildConf.ts
│   │   └── postBuild.ts
│   ├── vite
│   │   ├── plugin
│   │   └── proxy.ts
│   ├── constant.ts
│   ├── getConfigFileName.ts
│   └── utils.ts 
├── mock (模拟接口)
│   ├── sys 
│   ├── _createProductionServer.ts
│   └── _util.ts
├── public (静态资源)
├── scripts  (脚本)
├── src   (源代码)
│   ├── api (接口)
│   ├── assets(资源)
│   │   ├── font
│   │   ├── images
│   │   └── svg
│   ├── components(项目组件)
│   │   ├── Application
│   │   ├── Setting
│   │   ├── Tabs
│   │   └── Title
│   ├── core(gis核心)
│   │   └── GisCache.ts
│   ├── design(主题设计)
│   │   ├── token
│   │   ├── element-plus.scss
│   │   ├── index.scss
│   │   ├── mixins.scss
│   │   ├── public.scss
│   │   ├── scrollbar.scss
│   │   └── var.default.scss
│   ├── enums(项目枚举)
│   │   ├── appEnum.ts
│   │   ├── breakpointEnum.ts
│   │   ├── cacheEnum.ts
│   │   ├── compEnum.ts
│   │   ├── directionEnum.ts
│   │   ├── envEnum.ts
│   │   ├── exceptionEnum.ts
│   │   ├── httpEnum.ts
│   │   ├── menuEnum.ts
│   │   ├── mittTypeEnum.ts
│   │   ├── netEnum.ts
│   │   ├── pageEnum.ts
│   │   └── roleEnum.ts
│   ├── hooks(全局hook)
│   ├── layouts(布局)
│   ├── locales(国际化) 
│   ├── logics(启动逻辑) 
│   ├── plugins(插件) 
│   ├── router(路由) 
│   ├── settings(设置) 
│   ├── store(状态管理) 
│   ├── utils(项目工具函数) 
│   ├── views(模块页面) 
│   ├── App.vue(入口页面)
│   ├── main.ts(入口js)
│   └── vite-env.d.ts
├── types (类型)
├── .env
├── .env.development (多环境)
├── .eslintignore
├── .eslintrc.cjs
├── .prettierignore
├── .stylelintignore
├── .stylelintrc.cjs
├── CHANGELOG.md
├── README.md
├── auto-imports.d.ts
├── commitlint.config.cjs
├── components.d.ts
├── index.html
├── package.json
├── pnpm-lock.yaml
├── postcss.config.cjs
├── prettier.config.cjs
├── tsconfig.json
├── tsconfig.node.json
├── uno.config.ts(样式)
└── vite.config.ts

```

## 安装

```bash
npm install -g @dfsj/cli
# or
yarn global add @dfsj/cli
# or
pnpm add -g @dfsj/cli
```

## 升级

```bash
npm update -g @dfsj/cli
# or
yarn global upgrade --latest @dfsj/cli
# or
pnpm up --latest -g @dfsj/cli
```

## 卸载

```bash
npm uninstall -g @dfsj/cli
# or
yarn global remove @dfsj/cli
# or
pnpm remove -g @dfsj/cli
```

## 用法

dfsj init `模板类型` `项目名称`

```bash
dfsj init admin projectname
```

交互式选择模板并创建项目

```bash
dfsj create
```

当然也可以选择不安装`@dfsj/cli`创建项目

```bash
npx @dfsj/cli init thin myproject
# or
npx @dfsj/cli create
```

## 其他 
`dfsj -v`、`dfsj -h` 查看版本和帮助；也可以用于检查是否成功安装`@dfsj/cli`  
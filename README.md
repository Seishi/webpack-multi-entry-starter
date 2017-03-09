# webpack-multi-entry-starter

本工程适用于搭建多页面网站，在绝大多数情况下，开发和打包过程中会自动读取需要打包的页面并插入相关的样式和脚本，无需手动配置。

**项目结构**

```
.
├── README.md
├── build                 # webpack 开发、打包脚本
├── config                # webpack 配置
├── node_modules
├── package.json
├── src
│   ├── images
│   ├── scripts
│   │   ├── common.js     # 公用脚本
│   │   ├── components    # 组件脚本
│   │   └── page          # 页面级别脚本
│   ├── styles
│   │   ├── common        # 公用样式
│   │   ├── lib           # 第三方库样式
│   │   └── page          # 页面样式
│   └── views
│       ├── _layout.pug   # 布局文件
│       └── index.pug
└── yarn.lock
```

> views 目录下下划线开头的为布局或片段文件，参与打包但并不生成文件；页面如需插入脚本，则必须在 sripts/page 目录存在与之同名的js文件

## 使用

``` bash
# 安装依赖
npm install

# 开启开发服务
npm run dev

# 打包
npm run build
```

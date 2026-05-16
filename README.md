# 金属价格查看系统

## 项目介绍
一款功能完整的金属价格查看网页应用，支持金属价格查询、统计图表、用户管理、邮件提醒、在线客服等功能。

## 技术栈
- 后端：Node.js + Express + SQLite
- 前端：Vue.js 3 + Element Plus + ECharts
- 实时通信：Socket.io

## 功能特性

### 1. 金属价格展示
- 支持8种金属（黄金、白银、铜、铁、铝、锌、镍、锡）
- 实时显示价格及涨跌幅
- 价格每小时自动更新
- 支持金属名称搜索

### 2. 金属详情页
- 7天价格走势图（ECharts）
- 支持日期范围筛选
- 可发布询价单和意向单
- 关注/取消关注功能

### 3. 用户系统
- 用户注册和登录
- JWT身份认证
- 关注金属设置价格阈值
- 价格变动邮件提醒

### 4. 新闻模块
- 金属行业新闻展示
- 分页浏览
- 管理员可发布新闻

### 5. 在线客服
- 实时聊天功能（Socket.io）
- 会话历史记录
- 管理员可标记有效线索

### 6. 管理后台
- 用户管理（查看/删除用户）
- 客服会话管理
- 询价单查看
- 新闻发布

## 默认账号
- 管理员账号: `admin`
- 管理员密码: `admin123`

## 快速启动

### 方式一：分别启动

#### 1. 安装所有依赖
```bash
npm run install:all
```

#### 2. 启动后端服务 (端口 3000)
```bash
npm run dev:backend
```

#### 3. 启动前端服务 (端口 8080)
```bash
npm run dev:frontend
```

### 方式二：独立启动

#### 后端
```bash
cd backend
npm install
node server.js
```

#### 前端
```bash
cd frontend
npm install
npm run serve
```

## 项目结构
```
jinshu/
├── backend/                 # 后端目录
│   ├── server.js           # 入口文件
│   ├── database.js         # 数据库配置
│   ├── routes/             # 路由文件
│   │   ├── auth.js        # 认证路由
│   │   ├── metals.js      # 金属路由
│   │   ├── news.js        # 新闻路由
│   │   ├── favorites.js   # 关注路由
│   │   ├── inquiries.js   # 询价路由
│   │   ├── chat.js        # 客服路由
│   │   └── admin.js       # 管理路由
│   ├── services/           # 服务层
│   │   ├── priceFetcher.js # 价格抓取
│   │   └── emailService.js # 邮件服务
│   └── package.json
├── frontend/               # 前端目录
│   ├── src/
│   │   ├── main.js        # 入口文件
│   │   ├── App.vue        # 根组件
│   │   ├── router/        # 路由配置
│   │   ├── views/         # 页面组件
│   │   ├── components/    # 公共组件
│   │   └── utils/         # 工具函数
│   └── package.json
└── README.md
```

## 访问地址
- 前端页面: http://localhost:8080
- 后端API: http://localhost:3000

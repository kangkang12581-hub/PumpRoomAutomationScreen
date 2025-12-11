# 泵房自动化大屏系统

## 项目说明

这是泵房自动化系统的数据大屏展示应用，用于实时监控泵房运行状态。

## 功能特性

- ✅ **统一登录界面**：与 PumpRoomAutomationClient 共享相同的登录组件设计
- ✅ **权限控制**：仅允许 admin 账号登录访问大屏系统
- ✅ **实时数据展示**：12个泵站的实时监控数据
- ✅ **响应式缩放**：自动适应不同屏幕尺寸
- ✅ **自动刷新**：数据每5秒自动更新

## 技术栈

- Vue 3 + TypeScript
- Vue Router 4 - 路由管理
- Pinia - 状态管理
- Axios - HTTP 请求
- ECharts - 数据可视化
- Vite - 构建工具

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run dev
```

默认运行在 http://localhost:5174

## 构建生产版本

```bash
npm run build
```

## 预览生产版本

```bash
npm run preview
```

## 登录权限说明

⚠️ **重要提示**：

- 大屏系统仅限 **admin** 账号访问
- 使用其他账号登录时，即使认证成功也会被拒绝访问
- 如果非 admin 账号尝试访问，会显示提示信息并要求重新登录

## 项目结构

```
src/
├── components/         # 组件
│   ├── PumpCard.vue   # 泵站卡片
│   ├── PowerTable.vue # 功率表格
│   └── DailyWeight.vue # 日产量图表
├── views/             # 页面
│   ├── Login.vue      # 登录页面
│   └── Screen.vue     # 大屏页面
├── router/            # 路由配置
│   └── index.ts
├── services/          # API服务
│   └── api.ts
├── styles/            # 样式文件
│   └── global.css
├── App.vue           # 根组件
└── main.ts           # 入口文件
```

## API 配置

默认使用 Vite 代理转发请求到后端：

- 后端API：`/api` → `http://localhost:5000/api`
- WebSocket：`/ws` → `ws://localhost:5000`

可以通过环境变量 `VITE_API_BASE_URL` 自定义后端地址。

## 与 PumpRoomAutomationClient 的区别

| 特性 | PumpRoomAutomationClient | PumpRoomAutomationScreen |
|------|-------------------------|-------------------------|
| 用途 | 日常管理控制台 | 数据大屏展示 |
| 登录权限 | 所有已注册用户 | 仅限 admin 账号 |
| 功能 | 全功能管理系统 | 只读数据监控 |
| 端口 | 3000 | 5174 |
| 路由 | /dashboard, /video 等 | /screen |

## 开发说明

1. 登录组件 (`Login.vue`) 与 PumpRoomAutomationClient 保持一致的UI设计
2. API服务 (`api.ts`) 是简化版，仅包含大屏所需的接口
3. 路由守卫会验证用户权限，确保只有 admin 能访问大屏

## 常见问题

**Q: 为什么我登录成功后还是被跳转回登录页？**

A: 大屏系统仅限 admin 账号访问。请使用 admin 账号登录。

**Q: 如何修改允许访问的账号列表？**

A: 修改以下两个文件中的权限验证逻辑：
- `src/views/Login.vue` - `handleLogin` 函数
- `src/router/index.ts` - 路由守卫中的权限检查

**Q: 大屏显示比例不对怎么办？**

A: 大屏采用 1920x1080 的设计尺寸，会自动缩放适配。如需修改设计尺寸，编辑 `src/views/Screen.vue` 中的 `designWidth` 和 `designHeight` 常量。

## 更新日志

### v1.0.0 (2024-12-10)

- ✅ 添加登录功能，与 PumpRoomAutomationClient 统一登录界面
- ✅ 实现权限控制，仅允许 admin 账号访问
- ✅ 集成路由管理系统
- ✅ 集成后端 API 服务
- ✅ 保留原有大屏展示功能

## 许可证

© 2024 泵房自动化系统. 保留所有权利.



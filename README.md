# OpsPilot · 运维工程师面试作品集

一个面向运维工程师面试展示的响应式作品集项目。Vue 3 + Vite 前端可部署到 GitHub Pages；Spring Boot 3 + Redis 后端源码用于本地演示与架构讲解。Navicat 是数据库管理客户端，不是数据库引擎；本项目用 Redis 保存告警演示数据，后续可接入 MySQL 并用 Navicat 管理。

## 前端演示

```bash
npm install
npm run dev
```

构建静态文件：`npm run build`，输出在 `dist/`。告警弹窗、恢复操作、导出演示周报、切换时间范围均可交互。界面数据为模拟数据。

## Spring Boot + Redis API

要求 Java 17+、Docker。启动 API 和 Redis：

```bash
docker compose up --build
```

接口：`GET /api/alerts`、`POST /api/alerts`（JSON: `{"severity":"WARNING","title":"磁盘使用率高","resource":"db-01"}`）、`PATCH /api/alerts/{id}/resolve`。

可以用 `docker compose exec redis redis-cli` 查看 Redis；生产环境请通过环境变量配置 Redis 密码与网络策略。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个空的 **Public** 仓库，并将本目录推送到 `main` 分支。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 每次推送到 `main` 会自动构建 Vue 并部署静态页面。首次部署完成后，仓库页面会显示公开访问地址。

GitHub Pages 只托管静态前端，不运行 Spring Boot/Redis。线上页面用内置模拟数据；要让访客读取真实后端数据，需要另行部署 API/Redis 并配置 CORS 与前端 API 地址。`vite.config.js` 会按 GitHub 仓库子路径自动设置资源路径。

## 面试讲解建议

- 用可用率、资源使用率和告警数量展示运维可观测性。
- 演示告警处置闭环：发现、定位、建议处理、确认恢复。
- 说明 Vue 静态站点与 Spring Boot API 分离，以及 Redis 列表保存近期告警的设计取舍。
- 讨论生产化改进：MySQL 持久化审计记录、鉴权、告警去重、限流、日志追踪、健康检查、备份与告警通知。

> 本作品集以演示数据呈现。请将“林同学”、Acme 及架构指标替换为你的实际面试信息与真实经历。

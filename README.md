<div align="center">
  <img src="./public/favicon.png" alt="AII Logo" width="100" />
  <h1>AII Admin CLI</h1>
</div>

## 项目简介

`AII Admin CLI` 是一个基于 React 的后台管理模板，内置 **国际化（i18n）**、**亮/暗主题**、**标签页多开**、**动态菜单与路由**、以及 **AI Chat** 能力，面向中后台场景做可复用的组件与工程化沉淀。

---

## 目录

1. [特性](#特性)
2. [技术栈](#技术栈)
3. [快速开始](#快速开始)
4. [环境变量与模式](#环境变量与模式)
5. [Mock 与 Swagger](#mock-与-swagger)
6. [目录结构](#目录结构)
7. [项目约定](#项目约定)
8. [核心组件索引](#核心组件索引)
9. [贡献](#贡献)
10. [License](#license)

---

## 特性

- **国际化（i18n）**：基于 `i18next` / `react-i18next`，支持运行时切换语言
- **主题切换**：基于 antd Theme/Token，支持亮色/暗色模式
- **可复用业务组件**：表格、搜索表单、抽屉、弹窗、Tab 等能力沉淀
- **全局状态管理**：基于 Zustand，支持持久化
- **菜单驱动路由**：根据菜单结构生成/匹配路由（支持懒加载）
- **AI Chat**：支持流式响应、Markdown 渲染与代码块高亮（对接多家模型配置）

---

## 技术栈

- **React 18**
- **Vite 7**
- **Ant Design 6**
- **Tailwind CSS v4**：以布局为主，颜色等优先走 antd token（项目已将 antd token 映射到 Tailwind）
- **TanStack Router**
- **React Query**
- **Zustand**
- **Mock**：`vite-plugin-mock` + `mockjs`

---

## 快速开始

### 前置条件

- Node.js（建议使用 LTS 版本）
- 包管理器：`pnpm`

### 本地启动

```bash
pnpm install
pnpm dev
```

默认访问地址（以实际控制台输出为准）：

```text
http://localhost:3001
```

### 构建与预览

```bash
pnpm build
pnpm preview
```

---

## 环境变量与模式

- **公共变量**：`.env`（所有 mode 共享）
- **开发变量**：`.env.development`
- **生产变量**：`.env.production`

> 约定：Vite 只会将 `VITE_` 前缀变量暴露到客户端。涉及本地密钥建议使用 `.env.local`（通常在 `.gitignore` 中忽略，不提交仓库）。

### 关键变量（节选）

- **应用标题**
    - `VITE_TITLE`
- **环境标识**
    - `VITE_APP_ENV`（`development` / `production`）
- **Mock 开关**
    - `VITE_USE_MOCK`：开发默认 `true`，生产默认 `false`
- **AI 配置（按需填写 Key）**
    - `VITE_ALIYUN_AI_URL` / `VITE_ALIYUN_AI_KEY` / `VITE_ALIYUN_AI_MODEL`
    - `VITE_DEEPSEEK_AI_URL` / `VITE_DEEPSEEK_AI_KEY` / `VITE_DEEPSEEK_AI_MODEL`

---

## Mock 与 Swagger

### 开发期 Mock

开发环境默认开启 Mock（见 `.env.development` 的 `VITE_USE_MOCK=true`）。如需关闭，改为 `false` 后重启开发服务。

### 从 Swagger 生成 Mock 类型/客户端（可选）

项目提供脚本：

```bash
pnpm swagger-mock
```

---

## 目录结构

```text
.
├─ mock/                      # mock 数据、swagger 产物与 mock 配置
├─ public/
├─ src/
│  ├─ api/                    # API 封装（含 mock client）
│  ├─ components/             # 复用组件（AiiTable/AiiSearch/AiiDrawer/AiiModal...）
│  ├─ hooks/                  # 业务 hooks（table/modal/drawer/theme/language...）
│  ├─ layouts/                # 布局（Header/Sidebar/Main/Tab...）
│  ├─ locales/                # i18n 资源（含 business 模块）
│  ├─ routes/                 # TanStack Router 文件路由
│  ├─ stores/                 # Zustand stores
│  ├─ styles/                 # 全局样式（含 wrapper 等约定）
│  └─ utils/                  # 工具方法（http/i18n/menu/system...）
├─ preset.js                  # antd token -> Tailwind 映射
├─ tailwind.config.js
└─ vite.config.ts
```

---

## 项目约定

### UI 与样式

- **优先 antd 组件与 Token**：颜色/边框/阴影等视觉优先走 token，避免硬编码 `bg-white` / `text-black`
- **Tailwind 以布局为主**：网格/间距/对齐/溢出等
- **暗黑模式必须可用**：新增页面同时保证 light/dark 对比度
- **统一容器**：列表页/表单页等建议使用 `.wrapper`（见 `src/styles/global.css`）

（更完整规范见：`.cursor/rules/ui-guidelines.mdc`）

### 状态与全局反馈

- 全局状态：Zustand（支持持久化）
- 全局反馈：通过 `AppProvider` 挂载的 `window.$message / window.$modal / window.$notification`

### i18n

业务文案建议放在 `src/locales/business/**` 下，按模块维护中英文资源。

### 菜单与路由

菜单项通常包含：`key` / `label` / `icon` / `path` / `children`（以及用于定位页面的字段，如 `filePath` 等）。

---

## 核心组件索引

> 组件实现与示例以源码为准，建议直接从 `src/components/` 与对应 hooks 入手阅读。

- `src/components/AiiTable`：表格封装（分页、工具栏、行操作、批量等）
- `src/components/AiiSearch`：搜索表单封装（展开/收起、重置、联动）
- `src/components/AiiDrawer` + `src/hooks/drawer.hooks.ts`：抽屉能力（命令式调用）
- `src/components/AiiModal` + `src/hooks/modal.hooks.ts`：弹窗能力（命令式调用）
- `src/components/AiiTab`：多标签页能力与状态保活
- `src/components/AppProvider`：全局 `message/modal/notification` 注入

---

## 贡献

欢迎贡献。请先阅读 [Contributing Guide](CONTRIBUTING.md)（如存在），并遵循项目的 ESLint/Prettier 以及 UI 规范。

---

## License

本项目采用 [MIT License](LICENSE) 开源协议。

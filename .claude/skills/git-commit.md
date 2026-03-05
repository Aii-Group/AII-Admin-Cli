---
name: git-commit
description: 智能提交工具 - 按修改内容自动分组提交，支持格式化文档。每次提交都会运行 prettier 格式化所有修改的文件。
license: MIT
metadata:
    author: claude
    version: '1.0.0'
---

# Git Commit - 智能提交工具

按修改内容自动分组提交，支持格式化文档。

## 功能说明

1. 自动检测修改的文件并按功能分组
2. 每次提交自动运行 prettier 格式化修改的文件
3. 根据修改内容自动生成符合 commitlint 规范的提交信息
4. 支持查看提交历史和差异

## 使用方式

当用户输入 `/git` 或要求提交代码时，执行以下步骤：

### 1. 查看修改状态

```bash
git status --short
```

### 2. 按功能分组提交

根据修改的文件类型，自动分组提交：

| 文件类型                         | 提交类型   | 说明          |
| -------------------------------- | ---------- | ------------- |
| `src/routes/**`                  | `feat`     | 页面/路由修改 |
| `src/api/**`                     | `feat`     | API 相关修改  |
| `src/components/**`              | `feat`     | 组件修改      |
| `src/hooks/**`                   | `feat`     | Hooks 修改    |
| `src/stores/**`                  | `feat`     | 状态管理修改  |
| `src/types/**`                   | `feat`     | 类型定义修改  |
| `src/locales/**`                 | `i18n`     | 国际化修改    |
| `*.config.js`, `*.config.ts`     | `chore`    | 配置文件修改  |
| `package.json`, `pnpm-lock.yaml` | `chore`    | 依赖修改      |
| `docs/**`, `*.md`                | `docs`     | 文档修改      |
| `src/styles/**`, `*.css`         | `style`    | 样式修改      |
| `src/utils/**`                   | `refactor` | 工具函数修改  |
| `src/__tests__/**`, `*.test.ts`  | `test`     | 测试修改      |
| `src/utils/common.ts`            | `utils`    | 通用工具修改  |
| `src/utils/http/**`              | `utils`    | HTTP 工具修改 |

### 3. 提交流程

**重要：必须按功能分组逐个提交，不要一次性提交所有修改！**

1. 查看 `git status --short` 获取修改文件列表
2. 分析文件路径，将修改的文件按功能模块分组
3. 每个分组单独执行：
    - `git add <该分组的文件>`
    - `git commit -m "<type>: <description>"`
    - 等待 prettier 格式化完成
4. 所有分组提交完成后，执行 `git push` 推送到远程

### 4. 分组原则

- 每个有意义的修改单元作为一个独立的提交
- 组件修改、页面修改、国际化修改、配置修改等应该分开提交
- 如果某个文件的修改与其他文件不相关，应该单独提交
- 遵循"一个提交只做一件事"的原则

### 5. 提交信息规范

使用以下格式：

```
<type>: <简短描述>

<详细说明（可选）>
```

类型说明：

- `feat`: 新功能、页面、组件、API
- `fix`: Bug 修复
- `refactor`: 重构、工具函数
- `perf`: 性能优化
- `style`: 代码格式、样式
- `docs`: 文档修改
- `chore`: 构建、配置、依赖
- `i18n`: 国际化
- `test`: 测试

### 6. 示例

用户输入 `/git` 后：

1. 执行 `git status --short`
2. 分析修改文件，按功能分组：
    - 分组1: `src/routes/_authentication/dashboard.tsx` → `feat`
    - 分组2: `src/locales/zh.yaml`, `src/locales/en.yaml` → `i18n`
    - 分组3: `package.json` → `chore`
3. 依次提交每个分组：
    ```bash
    git add src/routes/_authentication/dashboard.tsx
    git commit -m "feat: 更新 dashboard 页面"
    # 等待格式化完成
    git add src/locales/
    git commit -m "i18n: 更新国际化文案"
    # 等待格式化完成
    git add package.json
    git commit -m "chore: 更新依赖"
    # 等待格式化完成
    ```
4. 所有分组提交完成后，执行 `git push`

## 注意事项

- 不使用 `--no-verify`，确保每次提交都经过格式化
- 保持提交粒度适中，按功能模块分组
- 提交信息使用中文描述修改内容

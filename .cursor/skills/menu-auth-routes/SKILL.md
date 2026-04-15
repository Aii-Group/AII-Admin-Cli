---
name: menu-auth-routes
description: 根据 MenuItem 菜单树在 src/routes/_authentication 下生成 TanStack Router 文件路由，按 staticData.key 维护 src/locales/business/Menu 双语文案；同名文件覆盖脚手架页面。在用户新增/调整后台菜单与页面路由、从接口或配置菜单批量落地路由与 i18n 时使用。
---

# 菜单驱动：认证区内路由 + Menu 文案

## 适用场景

- 用户给出 **菜单树**（`MenuItem[]` 或等价 JSON），要在本仓库落地 **站内页面**（与是否使用 mock、本地联调数据无关）。
- 需要 **覆盖** `src/routes/_authentication/` 下已有同名路由文件（脚手架演示页）。
- 按路由上的 **`staticData.key`** 生成或补全 **`Menu.{key}`** 的中英文 YAML。

## 菜单数据约定（与实现对齐）

菜单树由 **用户或接口提供**，须满足下方 **`MenuItem`** 结构；不要求与任何固定示例或 Mock 数据一致，**只要类型与字段约定成立即可**。运行时 `System.MenuOptions` 与 `MenuItem` 核心字段兼容，扩展字段以下表为准。

```ts
interface MenuItem {
    key: string
    label: string
    icon?: string
    path: string
    filePath?: string
    link?: string
    children?: MenuItem[]
    order?: number
    hidden?: boolean
    disabled?: boolean
    permission?: string
}
```

### `MenuItem` 书写约定（用户输入须满足的格式）

- **`key`**：[i18n-locales](../../rules/i18n-locales.mdc) 的 **Pascal_Snake**（如 `Basic_Form`、`External_Link`），与 `Menu.{key}`、路由 `staticData.key` 一致。
- **`path`**：以 `/` 开头；站内多级路径与文件路由一致，段名用 **kebab-case**（如 `/form/basic-form`）。外链子项仍写 `path`（如 `/iframe/Baidu`）并配合 **`link`**（http(s)）。
- **`label`**：展示用字符串；落地 i18n 时作 `Menu.*` 缺省文案参考。
- **`icon`**：与 `src/assets/svg/{icon}.svg` **文件名**一致（小写、无后缀，仅裸文件名）。
- **`children`**：有子菜单时必填数组；无子菜单的叶子可省略 **`children`**，或写 **`children: []`**。
- **对象字段顺序**（可读性建议，非强制）：`key` → `label` → `icon` → `path` → `children` / `link`（子节点中 `link` 仅在需要时出现）。

| 字段 | 作用 |
|------|------|
| `key` | 侧栏文案 `t('Menu.${key}')`、与路由 `staticData.key` **必须一致** |
| `path` | 站内路由 URL；菜单 `Link` 的 `to` 与此一致 |
| `label` | 接口/配置展示用；**页面标题以 i18n 为准**，生成 YAML 时可用作英文默认文案参考 |
| `icon` | 对应 `src/assets/svg/{icon}.svg` 文件名（无后缀） |
| `filePath` | 可选；若后端用于资源/文件映射，与文件路由落地无强关联时可忽略 |
| `link` | 外链；http(s) 会走 `/iframe/$name` + `search.url`，**不要**为其在 `_authentication` 下建页面 |
| `children` | 子菜单；仅 **叶子且站内 path** 需要真实路由文件（目录节点可只有菜单、无页面） |
| `order` / `hidden` / `disabled` / `permission` | 排序、展示、权限等；**落地路由与 i18n 时以 `key` / `path` / `children` / `link` 为主** |

路径解析与渲染：`src/utils/system.ts`（`resolveMenuItemPath`、`renderMenuItems`）。

## 路由文件放置与 URL

- 根布局：`src/routes/_authentication.tsx`（已存在，勿重复创建）。
- 子路由：放在 **`src/routes/_authentication/`** 下，由 `@tanstack/router-plugin/vite` 生成 `src/routeTree.gen.ts`。
- **URL ↔ 文件**（layout 子级）：`/foo` → `src/routes/_authentication/foo.tsx`；`/foo/bar` → `src/routes/_authentication/foo/bar.tsx`（多级目录与 TanStack 文件路由约定一致）。
- `createFileRoute` 的第一个参数为 **文件路由全 id**，与磁盘路径对应，例如：
  - 文件 `src/routes/_authentication/table.tsx` → `createFileRoute('/_authentication/table')`
  - 文件 `src/routes/_authentication/order/list.tsx` → `createFileRoute('/_authentication/order/list')`
- **`path` 必须与菜单项 `path` 一致**，否则侧栏 `Link` 无法命中。

### 路由文件名：kebab-case 与目录

- **磁盘文件名**一律 **全小写 + 连字符**（kebab-case），如 `basic-form.tsx`、`order-list.tsx`；**不要**使用 `Basic_Form.tsx`、`AdvancedForm.tsx` 等与 URL 不一致的混写。
- **菜单 `key`** 仍用 [i18n-locales](../../rules/i18n-locales.mdc) 的 **Pascal_Snake**（如 `Basic_Form`），写在路由 **`staticData.key`** 与 **`Menu.{key}`**；**URL `path`** 与文件名对齐，如 `/form/basic-form` → `form/basic-form.tsx`。
- **带子路由的段**：叶子文件直接放在 **`{segment}/`** 子目录下即可，**不要**额外创建 **`{segment}.tsx`** 父级占位文件，也不要在子目录里放 `route.tsx`、`index.tsx` 等。子页路由均直接挂在 `_authentication` 下。示例：`form/basic-form.tsx` + `form/advanced-form.tsx`（**`form/` 外不建 `form.tsx`**）。

## 生成单页的最小模板

按业务替换 `Segment`、`Menu_Key`、组件体；**优先与邻近路由文件的 import/风格一致**。

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authentication/Segment')({
    component: RouteComponent,
    staticData: { key: 'Menu_Key' },
})

function RouteComponent() {
    return null
}
```

### `staticData.key` 与标题、页签

- **`__root.tsx`** 用 `staticData.key` 设置 `document.title`：`t('Menu.${key}')`（Iframe 路由用 `params.name` 作为 `Menu` 键）。
- **`src/layouts/index.tsx`** 用 **`staticData.key`** 调 `addTab`；`System.Tab` 存 **`key`** 字段（与菜单、路由一致）。认证区内路由只需写 **`staticData: { key: 'Menu_Key' }`**，勿再使用 `code`。

## 国际化文件（按 `staticData.key`）

- 路径：**`src/locales/business/Menu/en.yaml`** 与 **`src/locales/business/Menu/zh.yaml`**（与 `import.meta.glob` 合并进同一命名空间）。
- 每个站内叶子菜单对应一项：

```yaml
Menu:
    Menu_Key: 中文或英文展示文案
```

- **键名**须符合仓库 [i18n-locales](../../rules/i18n-locales.mdc)：**每词首字母大写、词间下划线**（如 `Order_List`、`External_Link`），与菜单 `key`、`staticData.key` 一致。
- **必须中英同步**：同一 `key` 在两个文件同时增改。
- 若已有 `Menu:` 节点，**合并**新键，勿删无关旧键（除非用户要求清理）。
- **业务文案目录（必须）**：每个一级菜单 `key`（含有子菜单的父项）**必须**在 `src/locales/business/<菜单 key>/` 下创建 **`en.yaml`** 与 **`zh.yaml`**，根命名空间与菜单 `key` 一致（如 `Form:`、`Tab:`）。叶子菜单视业务需要按需创建（若只用 `Menu.*` 文案可不建）。
- **`business` 文案扁平（必须）**：在该根键下**只允许一层**——所有文案键直接平铺，用 **Pascal_Snake** 前缀区分含义，如 `Basic_Form_Placeholder`、`Advanced_Form_Placeholder`，对应 `t('Form.Basic_Form_Placeholder')`。**禁止**写成 `Form:\n  Basic_Form:\n    Placeholder:` 这类多层嵌套。
- **有 `children` 时**：侧栏仍用 **`Menu.{子 key}`**。**不要**为每个子菜单再建 `business/<子 key>/` 目录；子页相关文案全部写在 **父级** `src/locales/business/<父菜单 key>/` 的 **`en.yaml` / `zh.yaml`** 里，键名平铺（例如 `External_Link` 下用 `Baidu_Hint`、`React_Hint` 等，而非 `Baidu:\n  Hint:`）。

## 处理流程（Agent 执行顺序）

1. **遍历菜单树**，收集「需站内页面」的项：`path` 非外链 iframe 场景、且非纯父级占位（按用户要求决定是否给父级也生成占位页）。
2. 由 **`path`** 推导 `_authentication` 下相对路径（去掉前导 `/`，各段用 **kebab-case**）；有子菜单的段**不要**建同名 `{segment}.tsx` 父布局文件，叶子文件直接放进 `{segment}/` 目录，也不要保留 `route.tsx` / `index.tsx` 占位。**若文件已存在则整文件覆盖**（用户要求同名覆盖脚手架）。
3. 为每项设置 **`staticData.key === item.key`**（唯一主键，与页签、标题、侧栏一致）。
4. 更新 **`src/locales/business/Menu/en.yaml` / `zh.yaml`**：`Menu.{key}`（父节点 + 所有叶子节点均写入）；中文用 `label` 或用户给定文案，英文可用 `label` 或 Pascal_Snake 可读形式。
5. **为每个有 `children` 的父级菜单**新增 **`src/locales/business/{父 key}/en.yaml`** 与 **`zh.yaml`**（若已存在则合并），根键为菜单 `key`，内容按扁平规则写各子页文案占位（如 `Basic_Form_Placeholder: …`）。
6. 提醒：保存后由 Vite 插件重新生成 **`src/routeTree.gen.ts`**（开发服务器或 `pnpm` 构建）；不要手改 `routeTree.gen.ts`。
7. **不自动改**用户侧的菜单数据源（如本地联调、固定配置 JSON）除非用户要求；若存在此类数据，需自行保持 `path` / `key` 与路由一致。

## 外链与 iframe

- `link` 为 http(s) 时，菜单会链到 **`/iframe/$name`**，`name` 为菜单 **`key`**；对应文案仍在 **`Menu.{key}`**，路由文件为 **`src/routes/iframe/$name.tsx`**（动态段，一般不必为每个外链新建文件）。
- 勿把外链菜单误建成 `_authentication` 下的静态页面。

## 反例

- `staticData.key` 与菜单 `key` 不一致 → 侧栏与标题文案错位。
- 只改 `en.yaml` 不改 `zh.yaml` → 语言切换缺键。
- `path` 写成 `/table` 但文件生成在错误层级导致 `createFileRoute` id 与 URL 不一致 → 404 或菜单点不进去。
- 为有子菜单的父项建了 `form.tsx`（`<Outlet />` 包装）→ 多余文件，子路由直接挂在 `_authentication` 即可，删掉即可。
- `business/Form/` 未创建或文案写成多层嵌套（`Form:\n  Basic_Form:\n    Placeholder:`）→ `t('Form.Basic_Form_Placeholder')` 取不到值，应改为平铺。

## 可选延伸阅读

- 列表页完整范式：[quick-crud-page](../quick-crud-page/SKILL.md)（按需选用，非本 skill 必选步骤）。

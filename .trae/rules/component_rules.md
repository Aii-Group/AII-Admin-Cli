# AII-Admin-Cli 组件使用规范

## 1. 通用组件规范

### 1.1 组件导入

- 使用绝对路径从 `@/components` 导入公共组件
- 导入时使用大驼峰命名，如：`import AiiTable from '@/components/AiiTable'`

### 1.2 Props 传递

- 所有组件 Props 必须定义 TypeScript 类型
- 非必传 Props 必须设置默认值
- 使用解构赋值明确声明所需 Props

### 1.3 状态管理

- 组件内部状态使用 `useState` 或 `useReducer`
- 共享状态通过 Zustand Store 或 Context API 传递
- 避免在组件中直接修改 props

### 1.4 样式规范

- 组件样式优先使用 Tailwind CSS 工具类
- 复杂样式可使用 CSS Modules
- 全局样式放在 `/src/styles/global.css`

## 2. 组件使用规则

### 2.1 AiiChat 组件

#### 2.1.1 组件用途

AI 对话交互组件，支持 Markdown 渲染、代码高亮和思考过程展示

#### 2.1.2 Props 说明

无外部 Props，通过内部状态管理对话流程

#### 2.1.3 基本用法

```tsx
import AiiChat from '@/components/AiiChat'

function ChatPage() {
    return (
        <div className="chat-container">
            <AiiChat />
        </div>
    )
}
```

#### 2.1.4 注意事项

- 需要配置 AI 模型环境变量（`VITE_ALIYUN_AI_URL`、`VITE_ALIYUN_AI_KEY` 等）
- 支持代码块复制功能，自动适配深色/浅色主题
- 思考过程可展开/折叠，支持中断当前思考

### 2.2 AiiDrawer 组件

#### 2.2.1 组件用途

基于 Ant Design Drawer 的增强抽屉组件，支持上下文调用

#### 2.2.2 Props 说明

```typescript
interface AiiDrawerProps extends DrawerProps {
    // 继承 Ant Design Drawer 的所有 Props
}
```

#### 2.2.3 基本用法

```tsx
// 1. 提供 Drawer 上下文
import { DrawerProvider } from '@/components/AiiDrawer'

function App() {
    return <DrawerProvider>{/* 应用内容 */}</DrawerProvider>
}

// 2. 在组件中使用
import { useDrawer } from '@/components/AiiDrawer'

function MyComponent() {
    const { showDrawer } = useDrawer()

    const handleOpenDrawer = () => {
        showDrawer(<div>抽屉内容</div>, { title: '示例抽屉', width: 500 })
    }

    return <Button onClick={handleOpenDrawer}>打开抽屉</Button>
}
```

#### 2.2.4 注意事项

- 必须在 `DrawerProvider` 中使用 `useDrawer` 钩子
- 支持 Ant Design Drawer 的所有配置项
- 通过 `showDrawer` 方法动态创建抽屉

### 2.3 AiiSearch 组件

#### 2.3.1 组件用途

高级搜索表单组件，支持字段展开/折叠，通过 items 属性传递搜索字段数组

#### 2.3.2 Props 说明

```typescript
interface AiiSearchProps {
    items: React.ReactElement<typeof Form.Item>[] // 搜索字段数组
    cols?: number // 列数（暂未使用）
    onSearch?: (value: any) => void // 搜索回调函数
    wrapper?: boolean // 是否包装样式，默认 true
}
```

#### 2.3.3 基本用法

```tsx
import AiiSearch from '@/components/AiiSearch'
import { Form, Input, Select } from 'antd'

function MySearch() {
    const handleSearch = (values: any) => {
        console.log('搜索参数:', values)
    }

    // 定义搜索字段数组
    const searchItems = [
        <Form.Item name="name" label="名称">
            <Input placeholder="请输入名称" />
        </Form.Item>,
        <Form.Item name="status" label="状态">
            <Select
                placeholder="请选择状态"
                options={[
                    { label: '启用', value: '1' },
                    { label: '禁用', value: '0' },
                ]}
            />
        </Form.Item>,
        <Form.Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
        </Form.Item>,
        // 更多搜索字段...
    ]

    return <AiiSearch items={searchItems} onSearch={handleSearch} wrapper={true} />
}
```

#### 2.3.4 注意事项

- **必须通过 `items` 属性传递 Form.Item 数组**，不支持 children 方式
- 超过4个字段自动显示展开/折叠按钮，前4个字段始终显示
- 内置搜索和重置功能，搜索按钮类型为 `primary`，重置按钮为默认样式
- 搜索时会将 `undefined` 值转换为空字符串
- `wrapper` 属性控制是否显示底部边距样式，默认为 `true`
- 组件内部使用 Ant Design Form 包装，自动处理表单状态

### 2.4 AiiTable 组件

#### 2.4.1 组件用途

增强型表格组件，基于 Ant Design Table 封装，提供分页、批量操作、工具栏和自定义操作列等功能。支持粘性表头、响应式布局和国际化。

#### 2.4.2 类型定义

```typescript
// 工具栏配置
interface ToolbarProps {
    icon: React.ReactNode
    label: string
    onClick: () => void
}

// 操作列配置
interface OperationColumnProps {
    title: string
    key: string
    render: (record: any) => React.ReactNode
    fixed?: 'left' | 'right'
    width?: number | string
}

// 操作项配置
interface OperationItemProps {
    key: string
    icon?: React.ReactNode
    label: string | React.ReactNode
    danger?: boolean
    [key: `data-${string}`]: string | number
}

// 主要组件 Props
interface AiiTableProps<T> extends TableProps<T> {
    pagination: {
        total: number
        current: number
        pageSize: number
    }
    toolbar?: ToolbarProps[] // 工具栏按钮配置
    operations?:
        | ('EDIT' | 'DELETE' | 'COPY' | 'DETAIL' | { key: string; icon?: React.ReactNode; label: string })[]
        | ((
              record: T,
          ) => ('EDIT' | 'DELETE' | 'COPY' | 'DETAIL' | { key: string; icon?: React.ReactNode; label: string })[])
    onPageSizeChange: (pageSize: number) => void
    onPageChange: (page: number) => void
    onBatchDelete?: () => void
    onBatchExport?: () => void
    onOperationClick?: (key: string, record: any) => void
}
```

#### 2.4.3 基本用法

推荐结合 `useTable` 钩子使用，简化数据管理：

```tsx
import AiiTable from '@/components/AiiTable'
import useTable from '@/hooks/table.hooks'
import { fetchDataApi } from '@/api/data'
import { PlusOutlined, ExportOutlined } from '@ant-design/icons'

function MyTable() {
    const columns = [
        { title: '名称', dataIndex: 'name', key: 'name' },
        { title: '状态', dataIndex: 'status', key: 'status' },
        // 更多列定义
    ]

    // 使用 useTable 钩子管理表格数据
    const {
        loading,
        dataSource,
        pagination,
        onPageChange,
        onPageSizeChange,
        onSelectChange,
        selectedRows,
        selectedRowKeys,
    } = useTable(fetchDataApi)

    const handleOperation = (key: string, record: any) => {
        switch (key) {
            case 'EDIT':
                // 编辑操作
                break
            case 'DELETE':
                // 删除操作
                break
            case 'DETAIL':
                // 查看详情
                break
            // 其他自定义操作
        }
    }

    const handleBatchDelete = () => {
        // 批量删除逻辑
        console.log('批量删除:', selectedRows)
    }

    const handleBatchExport = () => {
        // 批量导出逻辑
        console.log('批量导出:', selectedRows)
    }

    return (
        <AiiTable
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={pagination}
            // 工具栏配置
            toolbar={[
                {
                    icon: <PlusOutlined />,
                    label: '新增',
                    onClick: () => console.log('新增'),
                },
                {
                    icon: <ExportOutlined />,
                    label: '导出',
                    onClick: () => console.log('导出'),
                },
            ]}
            // 操作列配置 - 字符串数组形式
            operations={['EDIT', 'DELETE', 'DETAIL']}
            // 操作列配置 - 函数形式（动态操作）
            operations={(record) => [
                'DETAIL',
                'EDIT',
                ...(record.status === 'active' ? ['DELETE'] : []),
                { key: 'CUSTOM', label: '自定义操作', icon: <CustomIcon /> },
            ]}
            // 行选择配置
            rowSelection={{
                selectedRowKeys,
                onChange: onSelectChange,
            }}
            // 事件处理
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onOperationClick={handleOperation}
            onBatchDelete={handleBatchDelete}
            onBatchExport={handleBatchExport}
        />
    )
}
```

#### 2.4.4 内置操作类型

组件提供以下内置操作类型，自动配置图标和国际化文本：

- `EDIT`: 编辑操作，使用 `FileEditingOne` 图标
- `DELETE`: 删除操作，使用 `Delete` 图标，标记为危险操作
- `COPY`: 复制操作，使用 `Copy` 图标
- `DETAIL`: 详情操作，使用 `DocDetail` 图标

#### 2.4.5 操作列渲染规则

- 当操作项 ≤ 2 个时：直接显示为按钮
- 当操作项 > 2 个时：显示为下拉菜单，使用 `MoreOne` 图标
- 操作列固定在表格右侧，默认宽度 100px

#### 2.4.6 批量操作功能

- 支持批量删除和批量导出功能
- 当有行被选中时，会在表头下方显示批量操作栏
- 批量操作栏会根据表格列数自动调整布局：
    - 列数 ≤ 4：单行布局
    - 列数 > 4：分栏布局（左侧显示选中信息，右侧显示操作按钮）

#### 2.4.7 分页功能

- 支持自定义页面大小：10、20、50、100
- 显示总数信息和当前页码
- 使用简洁分页器样式
- 页面大小变更通过下拉菜单选择

#### 2.4.8 样式特性

- 支持横向滚动（`scroll={{ x: 'max-content' }}`）
- 粘性表头（`sticky={{ offsetHeader: 0 }}`）
- 自定义 CSS 类名：`.aii-table`
- 响应式批量操作栏布局

#### 2.4.9 国际化支持

- 使用 `react-i18next` 进行国际化
- 支持操作按钮、分页信息、批量操作等文本的多语言切换
- 内置操作类型自动使用国际化文本

#### 2.4.10 与 useTable Hook 集成

推荐与 `useTable` Hook 配合使用，提供完整的表格数据管理：

```tsx
// useTable Hook 提供的功能
const {
    loading, // 加载状态
    dataSource, // 表格数据
    pagination, // 分页信息
    queryTableData, // 查询数据方法
    onPageChange, // 页码变更处理
    onPageSizeChange, // 页面大小变更处理
    onSearch, // 搜索处理
    selectedRows, // 选中的行数据
    selectedRowKeys, // 选中的行键
    onSelectChange, // 选择变更处理
} = useTable(apiMethod)
```

#### 2.4.11 注意事项

- 组件基于 Ant Design Table，继承所有原生 Table 属性
- `operations` 属性会自动在 `columns` 中添加操作列，无需手动添加
- 批量操作功能需要配置 `rowSelection` 属性
- 工具栏按钮使用 `type="text"` 样式
- 组件内部使用 `memo` 优化批量操作栏的渲染性能
- 支持自定义操作项的 `data-*` 属性用于数据传递

### 2.5 AiiTab 组件

#### 2.5.1 组件用途

高级标签页组件，支持动画切换、图标显示和自定义内容。基于 Framer Motion 实现流畅的切换动画和指示器移动效果。

#### 2.5.2 类型定义

```typescript
// 标签页配置
interface Tab {
    key: number // 标签页唯一标识
    label: string // 标签页显示文本
    icon?: React.ReactNode // 可选图标
    content?: React.ReactNode | string // 标签页内容
}

// 组件 Props
interface AiiTabProps {
    defaultActiveKey: number // 默认激活的标签页 key
    tabs: Tab[] // 标签页配置数组
    onTabClick?: (label: string) => void // 标签页点击回调
    simple?: boolean // 简洁模式，默认 true
}
```

#### 2.5.3 基本用法

```tsx
import AiiTab from '@/components/AiiTab'
import { UserOutlined, SettingOutlined, FileOutlined } from '@ant-design/icons'

function MyTabComponent() {
    const handleTabClick = (label: string) => {
        console.log('点击标签页:', label)
    }

    const tabs = [
        {
            key: 1,
            label: '用户信息',
            icon: <UserOutlined />,
            content: (
                <div className="p-16">
                    <h3>用户信息内容</h3>
                    <p>这里是用户信息的详细内容...</p>
                </div>
            ),
        },
        {
            key: 2,
            label: '系统设置',
            icon: <SettingOutlined />,
            content: (
                <div className="p-16">
                    <h3>系统设置内容</h3>
                    <p>这里是系统设置的详细内容...</p>
                </div>
            ),
        },
        {
            key: 3,
            label: '文档管理',
            icon: <FileOutlined />,
            content: '这是文档管理的文本内容',
        },
    ]

    return (
        <AiiTab
            defaultActiveKey={1}
            tabs={tabs}
            onTabClick={handleTabClick}
            simple={false} // 显示底部边框
        />
    )
}
```

#### 2.5.4 简洁模式用法

```tsx
function SimpleTabExample() {
    const simpleTabs = [
        {
            key: 1,
            label: '基础信息',
            content: <div>基础信息内容</div>,
        },
        {
            key: 2,
            label: '详细配置',
            content: <div>详细配置内容</div>,
        },
    ]

    return (
        <AiiTab
            defaultActiveKey={1}
            tabs={simpleTabs}
            simple={true} // 简洁模式，无底部边框
        />
    )
}
```

#### 2.5.5 动画特性

- **指示器动画**：使用 Framer Motion 的 `layoutId` 实现流畅的指示器移动效果
- **内容切换动画**：支持透明度和模糊效果的过渡动画
- **弹性动画**：指示器移动使用弹性动画（spring），参数为 `stiffness: 500, damping: 30`
- **内容动画**：内容切换使用 `easeInOut` 缓动，持续时间 0.3 秒

#### 2.5.6 样式特性

- **主题适配**：支持浅色和深色主题自动切换
- **响应式设计**：使用 Tailwind CSS 实现响应式布局
- **自定义样式类**：
    - `.aii-tab`：主容器样式
    - `.aii-tab-nav`：导航栏样式
    - `.aii-tab-nav-item`：标签页项样式
    - `.aii-tab-nav-item-active`：激活状态样式
    - `.aii-tab-nav-indicator`：指示器样式
    - `.aii-tab-content`：内容区域样式

#### 2.5.7 交互行为

- **点击切换**：点击标签页标题切换到对应内容
- **悬停效果**：标签页项支持悬停时颜色变化
- **键盘导航**：暂不支持键盘导航（可扩展功能）
- **回调触发**：切换标签页时触发 `onTabClick` 回调，传递标签页 label

#### 2.5.8 内容渲染

- **React 节点**：支持传入 JSX 元素作为内容
- **字符串内容**：支持传入纯文本内容
- **动态内容**：内容可以是动态生成的组件
- **内容动画**：使用 `AnimatePresence` 实现内容的进入和退出动画

#### 2.5.9 配置选项

- **defaultActiveKey**：设置默认激活的标签页，必传参数
- **tabs**：标签页配置数组，每个标签页必须有唯一的 key
- **onTabClick**：可选的点击回调函数，接收标签页 label 参数
- **simple**：简洁模式开关，控制是否显示底部边框，默认为 true

#### 2.5.10 注意事项

- **唯一 key**：每个标签页的 key 必须唯一，用于 React 的 key 属性和状态管理
- **图标可选**：icon 属性为可选，不传入时只显示文本标签
- **内容可选**：content 属性为可选，可以只显示标签页导航
- **依赖库**：组件依赖 `framer-motion` 和 `classnames` 库
- **样式依赖**：需要引入组件的 CSS 文件和 Tailwind CSS
- **主题变量**：使用项目中定义的主题色变量，确保主题一致性
- **性能优化**：使用 `useRef` 和 `useEffect` 优化指示器位置计算
- **动画性能**：Framer Motion 动画使用 GPU 加速，性能良好

### 2.6 AppProvider 组件

#### 2.6.1 组件用途

全局状态提供者，提供消息、模态框和通知的全局访问

#### 2.6.2 基本用法

```tsx
import AppProvider from '@/components/AppProvider'
import { ConfigProvider } from 'antd'

function App() {
    return (
        <ConfigProvider>
            <AppProvider>{/* 应用内容 */}</AppProvider>
        </ConfigProvider>
    )
}
```

#### 2.6.3 使用全局 API

```tsx
// 在任何组件中
window.$message.success('操作成功')
window.$modal.confirm({
    title: '确认',
    content: '确定要删除吗？',
})
window.$notification.info({
    message: '通知',
    description: '这是一条通知',
})
```

#### 2.6.4 注意事项

- 应在应用最顶层使用
- 依赖 Ant Design 的 message、modal、notification 组件
- 提供全局访问点，避免在组件中重复创建

### 2.7 SvgIcon 组件

#### 2.7.1 组件用途

动态加载 SVG 图标组件

#### 2.7.2 Props 说明

```typescript
interface SvgIconProps extends React.SVGAttributes<SVGSVGElement> {
    icon: string // 图标名称（assets/svg目录下的SVG文件名）
}
```

#### 2.7.3 基本用法

```tsx
import SvgIcon from '@/components/SvgIcon'

function MyComponent() {
    return (
        <div>
            <SvgIcon icon="robot" width={24} height={24} />
            <SvgIcon icon="user" className="text-primary" />
        </div>
    )
}
```

#### 2.7.4 注意事项

- 图标文件必须放在 `/src/assets/svg/` 目录下
- 导入时不需要 `.svg` 扩展名
- 支持所有 SVG 元素属性（width、height、className 等）
- 图标加载失败时会显示空白

## 3. 组件开发规范

### 3.1 组件设计原则

- 单一职责：每个组件只做一件事
- 可复用性：设计时考虑多种使用场景
- 可测试性：组件逻辑清晰，便于单元测试
- 性能优化：避免不必要的渲染和计算

### 3.2 文件组织

- 每个组件一个目录，目录名使用大驼峰
- 组件入口文件为 `index.tsx`
- 类型定义放在 `[组件名].types.ts`
- 样式文件为 `index.css` 或 `index.module.css`

### 3.3 命名规范

- 组件名：大驼峰，如 `AiiTable`
- Props 接口：组件名+Props，如 `AiiTableProps`
- 类型文件：组件名+.types.ts，如 `AiiTable.types.ts`

## 4. 组件测试规范

- 关键组件编写单元测试
- 使用 React Testing Library
- 测试覆盖主要功能点和边界情况
- 测试文件放在组件目录下的 `__tests__` 文件夹

---

本规范会随着组件库扩展不断更新，请开发人员定期查阅。组件使用中有任何问题或建议，请联系前端团队负责人。

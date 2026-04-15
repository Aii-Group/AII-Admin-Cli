---
name: quick-crud-page
description: 在本仓库中快速搭建服务端分页列表页：useTable、AiiSearch、AiiTable、TanStack Router。弹窗（useModal）、抽屉（useDrawer）、命令式确认（$modal.confirm）、工具栏、行操作、批量栏均为按需选用，按用户明确要求再接入。Skill 内嵌完整参考代码，不依赖仓库中的演示路由文件。在用户新增列表页、管理后台表格页或 CRUD 页面时使用。
---

# 快速 CRUD 列表页（AII-Admin-Cli）

## 何时使用

- 需要**服务端分页列表**（可选：筛选、工具栏、行内操作、批量操作、弹窗/抽屉）。
- 技术栈：`antd`、`@tanstack/react-router`、`react-i18next`、`@icon-park/react`。

## 必选 vs 按需求选用

| 层级 | 内容 |
|------|------|
| **建议默认具备** | 路由、`useTable` + 列表 API、`AiiSearch`（可无筛选项）、`AiiTable` 的 `columns` / `dataSource` / `pagination` / 分页回调 |
| **仅当用户/需求明确要求时再加** | `useModal` 多槽位弹窗、`useDrawer` 侧栏、`window.$modal.confirm` 轻确认、`toolbar`、`operations`、`rowSelection` + `batchOperations` |

不要默认堆齐创建/编辑弹窗、详情抽屉；以用户描述为准裁剪。

## 参考实现（内嵌全文）

以下示例演示各类可选能力如何拼在一起，便于复制后按需求裁剪。**新建或生成业务列表页时，以本段内嵌代码为首要依据；仓库里若仍有仅作联调/演示的路由，不必与之对齐，上线前也可移除。**

- 首屏拉数：优先 `useEffect(() => { void queryTableData() }, [])`；**不要**把 `queryTableData` 放进依赖数组。仅在「切换语言必须重拉列表」等少数场景再引入 `t` 等依赖并接受额外请求。
- 行选 + 批量：只有需要批量操作时才接 `rowSelection` 与 `batchOperations`；`onChange` 须把前两参交给 `onSelectChange`。
- `toolbar[].label` 必须是 **string**。

```tsx
import { useCallback, useEffect, useMemo } from 'react'

import { Form, Input, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import type { TableColumnsType, TableProps } from 'antd'

import useTable from '@/hooks/table.hooks'
import { OperationTypeEnum } from '@/enums'
import { mockApiClient } from '@/utils/http'
import AiiTable from '@/components/AiiTable'
import AiiSearch from '@/components/AiiSearch'
// --- 可选：多槽位弹窗（复杂表单 / 多流程）---
import { useModal } from '@/hooks/modal.hooks'
// --- 可选：单例抽屉（详情 / 宽面板）---
import { useDrawer } from '@/hooks/drawer.hooks'
import { createFileRoute } from '@tanstack/react-router'
import type { TableDataItem } from '@/api/mockApiClient/types'
import { Copy, Delete, DocDetail, DownloadFour, FileEditingOne, Newlybuild, Refresh } from '@icon-park/react'

import type { OperationButtonItem } from '@/components/AiiTable'

export const Route = createFileRoute('/_authentication/your-resource')({
    component: RouteComponent,
})

type TableRowSelection<T = TableDataItem> = TableProps<T>['rowSelection']

// 可选：无 useModal 时删除本常量与 modal 相关逻辑
const MODAL_SLOT_IDS: string[] = ['example']

function RouteComponent() {
    const { t } = useTranslation()

    const modal = useModal(MODAL_SLOT_IDS)
    const { showDrawer } = useDrawer()

    const {
        dataSource,
        loading,
        onPageChange,
        onPageSizeChange,
        pagination,
        selectedRowKeys,
        selectedRows,
        onSelectChange,
        onSearch,
        queryTableData,
    } = useTable<TableDataItem>(mockApiClient.getTableData)

    const searchItem = useMemo(
        () => [
            <Form.Item key="username" name="username">
                <Input placeholder="名称" />
            </Form.Item>,
            <Form.Item key="age" name="age">
                <Input placeholder="年龄" />
            </Form.Item>,
            <Form.Item key="address" name="address">
                <Input placeholder="地址" />
            </Form.Item>,
            <Form.Item key="email" name="email">
                <Input placeholder="邮件" />
            </Form.Item>,
            <Form.Item key="phone" name="phone">
                <Input placeholder="电话" />
            </Form.Item>,
        ],
        [],
    )

    const columns = useMemo<TableColumnsType<TableDataItem>>(
        () => [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                fixed: 'left',
            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
                ellipsis: true,
                render: (address) => (
                    <Tooltip placement="top" title={address}>
                        <div className="max-w-60 overflow-hidden text-ellipsis whitespace-nowrap">{address}</div>
                    </Tooltip>
                ),
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Phone',
                dataIndex: 'phone',
                key: 'phone',
                width: 120,
            },
            {
                title: 'Create Time',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 180,
            },
        ],
        [],
    )

    // 可选：无批量操作时删除 rowSelection 与 AiiTable 上 rowSelection / batchOperations
    const rowSelection = useMemo<TableRowSelection>(
        () => ({
            selectedRowKeys,
            onChange: onSelectChange,
        }),
        [selectedRowKeys, onSelectChange],
    )

    // 可选：无 useModal 时改为内联 openModal 或删掉
    const openExampleModal = useCallback(
        (type: (typeof OperationTypeEnum)[keyof typeof OperationTypeEnum], record?: TableDataItem) => {
            modal.example.openModal({
                title: t(`Action.${type}`),
                content: (
                    <div>{record ? <pre className="text-xs">{JSON.stringify(record, null, 2)}</pre> : '这是一个示例弹窗'}</div>
                ),
                onOk: async () => {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    modal.example.closeModal()
                    window.$message.success(t('Message.Operation_Success'))
                },
                onCancel: () => {
                    modal.example.closeModal()
                },
            })
        },
        [modal, t],
    )

    // 可选：无顶部按钮时传 undefined 或不传 toolbar
    const toolbar = useMemo(
        () => [
            {
                icon: <Newlybuild />,
                label: t('Action.Create'),
                onClick: () => {
                    openExampleModal(OperationTypeEnum.CREATE)
                },
            },
            {
                icon: <DownloadFour />,
                label: t('Action.Export'),
                onClick: () => {
                    window.$modal.confirm({
                        title: t('Action.Export'),
                        content: '确定要导出吗',
                        onOk: () => {
                            window.$message.success(t('Message.Operation_Success'))
                        },
                    })
                },
            },
            {
                icon: <Refresh />,
                label: t('Action.Refresh'),
                onClick: () => {
                    void queryTableData()
                },
            },
        ],
        [t, openExampleModal, queryTableData],
    )

    // 可选：无行内操作时删除 operations
    const rowOperations = useMemo<OperationButtonItem<TableDataItem>[]>(
        () => [
            {
                key: 'DETAIL',
                icon: <DocDetail />,
                label: t('Action.Detail'),
                onClick: (record) => {
                    showDrawer(<div>{JSON.stringify(record, null, 2)}</div>, {
                        title: 'DETAIL',
                        size: 600,
                    })
                },
            },
            {
                key: 'EDIT',
                icon: <FileEditingOne />,
                label: t('Action.Edit'),
                onClick: (record) => {
                    openExampleModal(OperationTypeEnum.EDIT, record)
                },
            },
            {
                key: 'COPY',
                icon: <Copy />,
                label: t('Action.Copy'),
                onClick: () => {
                    window.$modal.confirm({
                        title: t('Action.Copy'),
                        content: '复制复制复制🤔',
                        onOk: () => {
                            window.$message.success(t('Message.Operation_Success'))
                        },
                    })
                },
            },
            {
                key: 'DELETE',
                icon: <Delete />,
                label: t('Action.Delete'),
                danger: true,
                onClick: () => {
                    window.$modal.confirm({
                        title: t('Action.Delete'),
                        content: t('Tips.Delete_Tips'),
                        okText: t('Action.Delete'),
                        okButtonProps: {
                            danger: true,
                        },
                        onOk: () => {
                            window.$message.success(t('Message.Operation_Success'))
                        },
                    })
                },
            },
        ],
        [t, openExampleModal, showDrawer],
    )

    const onBatchDelete = useCallback(() => {
        console.log('onBatchDelete', selectedRows)
    }, [selectedRows])

    const onBatchExport = useCallback(() => {
        console.log('onBatchExport', selectedRows)
    }, [selectedRows])

    const batchOperations = useMemo(
        () => [
            {
                key: 'DELETE',
                icon: <Delete />,
                label: 'Batch Delete',
                onClick: onBatchDelete,
                danger: true,
            },
            {
                key: 'EXPORT',
                icon: <DownloadFour />,
                label: 'Batch Export',
                onClick: onBatchExport,
            },
        ],
        [onBatchDelete, onBatchExport],
    )

    useEffect(() => {
        void queryTableData()
    }, [])

    return (
        <>
            <AiiSearch items={searchItem} onSearch={onSearch} />
            <div className="wrapper">
                <AiiTable<TableDataItem>
                    rowKey="id"
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    toolbar={toolbar}
                    operations={rowOperations}
                    onPageSizeChange={onPageSizeChange}
                    onPageChange={onPageChange}
                    rowSelection={rowSelection}
                    batchOperations={batchOperations}
                />
            </div>
        </>
    )
}
```

说明：`openExampleModal` 第二参为可选行数据；创建不传，编辑传入 `record`。`type` 使用 `OperationTypeEnum` 的**值**（如 `'Create'`），以便 `t(\`Action.${type}\`)` 解析为 `Action.Create` 等已有 i18n key。

## 极简骨架（无弹窗、无抽屉、无批量）

```tsx
function ListPage() {
  const { loading, dataSource, pagination, onPageChange, onPageSizeChange, onSearch, queryTableData } =
    useTable<YourRow>(yourListApi)

  useEffect(() => {
    void queryTableData()
  }, [])

  return (
    <>
      <AiiSearch items={searchItem} onSearch={onSearch} />
      <div className="wrapper">
        <AiiTable<YourRow>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </>
  )
}
```

## 实现清单摘要

1. **列表 API**：满足 `ApiMethod<T, P>`，`P` 含 `current`、`pageSize`；返回 `CommonResult<PageData<T>>`，`success !== false` 且 `data` 可规范化（见 `table.hooks`）。
2. **路由**：`createFileRoute` 路径与文件路径一致。
3. **按需叠加**：`useModal` / `useDrawer` / `$modal.confirm` / `toolbar` / `operations` / `rowSelection` + `batchOperations` — 仅当需求要求。
4. **i18n**：`src/locales/zh.yaml` 与 `en.yaml` 同步新增 key。

## 组件细则（按需查阅）

- `AiiTable` / `useTable` → `.cursor/rules/aiitable-usage.mdc`
- `AiiSearch` → `.cursor/rules/aiisearch-usage.mdc`
- `useModal` → `.cursor/rules/aiimodal-usage.mdc`
- `useDrawer` → `.cursor/rules/aiidrawer-usage.mdc`

## 常见陷阱

- `queryTableData` 不宜作为 `useEffect` 依赖，避免重复请求。
- 批量栏依赖 `rowSelection.onChange` 转发到 `onSelectChange`。
- 提交创建/编辑成功后调用 `queryTableData()` 刷新列表；删除同理。

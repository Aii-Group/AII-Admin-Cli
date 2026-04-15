import { useCallback, useEffect, useMemo } from 'react'

import { Form, Input, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import type { TableColumnsType, TableProps } from 'antd'

import useTable from '@/hooks/table.hooks'
import { OperationTypeEnum } from '@/enums'
import { mockApiClient } from '@/utils/http'
import AiiTable from '@/components/AiiTable'
import AiiSearch from '@/components/AiiSearch'
import { useModal } from '@/hooks/modal.hooks'
import { useDrawer } from '@/hooks/drawer.hooks'
import { createFileRoute } from '@tanstack/react-router'
import type { TableDataItem } from '@/api/mockApiClient/types'
import { Copy, Delete, DocDetail, DownloadFour, FileEditingOne, Newlybuild, Refresh } from '@icon-park/react'

import type { OperationButtonItem } from '@/components/AiiTable'

export const Route = createFileRoute('/_authentication/table')({
    component: RouteComponent,
    staticData: { key: 'Table' },
})

type TableRowSelection<T = TableDataItem> = TableProps<T>['rowSelection']

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

    const rowSelection = useMemo<TableRowSelection>(
        () => ({
            selectedRowKeys,
            onChange: onSelectChange,
        }),
        [selectedRowKeys, onSelectChange],
    )

    const openExampleModal = useCallback(
        (type: keyof typeof OperationTypeEnum, record?: TableDataItem) => {
            modal.example.openModal({
                title: t(`Action.${type}`),
                content: <div>这是一个示例弹窗</div>,
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
                    window.$message.success('我刷新了🫡')
                },
            },
        ],
        [t, modal],
    )

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
        [t, modal, showDrawer],
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
    }, [t])

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

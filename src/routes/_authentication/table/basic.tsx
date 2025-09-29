import { useEffect } from 'react'

import { DeleteOutlined, ExportOutlined } from '@ant-design/icons'

import apiClient from '@/utils/http'
import useTable from '@/hooks/table.hooks'
import { createFileRoute } from '@tanstack/react-router'
import AiiTablePro from '@/components/AiiTablePro'
import {
    DownloadFour,
    Filter,
    Newlybuild,
    Refresh,
    Copy,
    Delete,
    DocDetail,
    Down,
    FileEditingOne,
    MoreOne,
} from '@icon-park/react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/_authentication/table/basic')({
    component: () => <Basic />,
    staticData: {
        code: 'Basic_Table',
        langCode: 'Menu.Basic_Table',
    },
})

const Basic: React.FC = () => {
    const { t } = useTranslation()
    const { queryTableData, dataSource, loading, onPageChange, onPageSizeChange, pagination } = useTable(
        apiClient.getTableData,
    )

    const columns = [
        {
            title: 'Name',
            accessorKey: 'name',
            cell: ({ getValue }: any) => <span className="text-light-colorPrimary">{getValue()}</span>,
        },
        {
            title: 'Age',
            accessorKey: 'age',
        },
        {
            title: 'Address',
            accessorKey: 'address',
            ellipsis: true,
        },
        {
            title: 'Email',
            accessorKey: 'email',
        },
        {
            title: 'Phone',
            accessorKey: 'phone',
        },
        {
            title: 'Create Time',
            accessorKey: 'createTime',
        },
    ]

    const operations = [
        {
            key: 'edit',
            label: t('Action.Edit'),
            icon: <FileEditingOne />,
            onClick: (record: any) => {
                console.log('Edit', record)
            },
        },
        {
            key: 'copy',
            label: t('Action.Copy'),
            icon: <Copy />,
            onClick: (record: any) => {
                console.log('Copy', record)
            },
        },
        {
            key: 'detail',
            label: t('Action.Detail'),
            icon: <DocDetail />,
            onClick: (record: any) => {
                console.log('Detail', record)
            },
        },
        {
            key: 'delete',
            label: t('Action.Delete'),
            icon: <Delete />,
            danger: true,
            onClick: (record: any) => {
                console.log('Delete', record)
            },
        },
    ]

    useEffect(() => {
        queryTableData()
    }, [])

    return (
        <>
            <div className="wrapper mb-10"></div>
            <div className="wrapper">
                <AiiTablePro
                    data={dataSource as any[]}
                    columns={columns}
                    loading={loading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        onPageChange: (current: number) => {
                            onPageChange(current)
                        },
                        onPageSizeChange: (current: number, size: number) => onPageSizeChange(size),
                    }}
                    toolbar={[
                        {
                            key: 'create',
                            icon: <Newlybuild />,
                            label: t('Action.Create'),
                            onClick: () => {
                                console.log('Create')
                            },
                        },
                        {
                            key: 'export',
                            icon: <DownloadFour />,
                            label: t('Action.Export'),
                            onClick: () => {
                                console.log('Export')
                            },
                        },
                        {
                            key: 'refresh',
                            icon: <Refresh />,
                            label: t('Action.Refresh'),
                            onClick: () => {
                                console.log('Refresh')
                            },
                        },
                        {
                            key: 'filter',
                            icon: <Filter />,
                            label: t('Action.Filter'),
                            onClick: () => {
                                console.log('Filter')
                            },
                        },
                    ]}
                    operations={operations}
                    rowSelection={{
                        enabled: true,
                        batchActions: [
                            {
                                key: 'delete',
                                label: '批量删除',
                                danger: true,
                                icon: <DeleteOutlined />,
                                onClick: (selectedRows) => {
                                    console.log('批量删除:', selectedRows)
                                },
                            },
                            {
                                key: 'export',
                                label: '批量导出',
                                icon: <ExportOutlined />,
                                onClick: (selectedRows) => {
                                    console.log('批量导出:', selectedRows)
                                },
                            },
                            {
                                key: 'more',
                                label: '批量操作',
                                icon: <ExportOutlined />,
                                onClick: (selectedRows) => {
                                    console.log('批量操作:', selectedRows)
                                },
                            },
                        ],
                    }}
                />
            </div>
        </>
    )
}

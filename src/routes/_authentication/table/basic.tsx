import { useEffect } from 'react'

import { DeleteOutlined, ExportOutlined } from '@ant-design/icons'

import apiClient from '@/utils/http'
import useTable from '@/hooks/table.hooks'
import { createFileRoute } from '@tanstack/react-router'
import AiiTablePro from '@/components/AiiTablePro'
import { DownloadFour, Filter, Newlybuild, Refresh } from '@icon-park/react'
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

    useEffect(() => {
        queryTableData()
    }, [])

    return (
        <div className="wrapper">
            <AiiTablePro
                data={dataSource as any[]}
                columns={columns}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (current: number) => {
                        onPageChange(current)
                    },
                    onShowSizeChange: (current: number, size: number) => onPageSizeChange(size),
                }}
                toolbar={[
                    {
                        key: 'create',
                        icon: <Newlybuild />,
                        label: t('Action.Create'),
                        onClick: () => {},
                    },
                    {
                        key: 'export',
                        icon: <DownloadFour />,
                        label: t('Action.Export'),
                        onClick: () => {},
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
                rowSelection={{
                    enabled: true,
                    onSelectionChange: (selectedRows) => {
                        console.log('Selected rows:', selectedRows)
                    },
                    batchActions: [
                        {
                            key: 'delete',
                            label: '批量删除',
                            icon: <DeleteOutlined />,
                            type: 'primary',
                            onClick: (selectedRows, selectedKeys) => {
                                console.log('批量删除:', selectedRows, selectedKeys)
                            },
                        },
                        {
                            key: 'export',
                            label: '批量导出',
                            icon: <ExportOutlined />,
                            onClick: (selectedRows, selectedKeys) => {
                                console.log('批量导出:', selectedRows, selectedKeys)
                            },
                        },
                    ],
                }}
            />
        </div>
    )
}

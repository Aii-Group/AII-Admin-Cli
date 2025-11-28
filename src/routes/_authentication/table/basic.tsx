/**
 * @Alpha - This API is still in development and may change in the future.
 * @description - This is the Alpha version of the AiiTablePro component.
 */

import { useEffect, useState } from 'react'

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
import { AiiColumnDef, ColumnDef, TableData } from '@/components/AiiTablePro/AiiTablePro.types'

export const Route = createFileRoute('/_authentication/table/basic')({
    component: () => <Basic />,
    staticData: {
        code: 'Basic_Table',
        langCode: 'Menu.Basic_Table',
    },
})

// 树型结构的模拟数据
const treeData = [
    {
        id: '1',
        name: '部门A',
        age: 0,
        address: '总部大楼',
        email: 'dept-a@company.com',
        phone: '010-12345678',
        createTime: '2023-01-01',
        children: [
            {
                id: '1-1',
                name: '张三',
                age: 28,
                address: '北京市朝阳区',
                email: 'zhangsan@company.com',
                phone: '13800138001',
                createTime: '2023-01-15',
                children: [
                    {
                        id: '1-1-1',
                        name: '项目Alpha',
                        age: 0,
                        address: '项目组办公室',
                        email: 'alpha@company.com',
                        phone: '010-11111111',
                        createTime: '2023-02-01',
                    },
                    {
                        id: '1-1-2',
                        name: '项目Beta',
                        age: 0,
                        address: '项目组办公室',
                        email: 'beta@company.com',
                        phone: '010-22222222',
                        createTime: '2023-02-15',
                    },
                ],
            },
            {
                id: '1-2',
                name: '李四',
                age: 32,
                address: '北京市海淀区',
                email: 'lisi@company.com',
                phone: '13800138002',
                createTime: '2023-01-20',
            },
            {
                id: '1-3',
                name: '王五',
                age: 25,
                address: '北京市西城区',
                email: 'wangwu@company.com',
                phone: '13800138003',
                createTime: '2023-01-25',
            },
        ],
    },
    {
        id: '2',
        name: '部门B',
        age: 0,
        address: '分部大楼',
        email: 'dept-b@company.com',
        phone: '021-87654321',
        createTime: '2023-01-02',
        children: [
            {
                id: '2-1',
                name: '赵六',
                age: 30,
                address: '上海市浦东新区',
                email: 'zhaoliu@company.com',
                phone: '13800138004',
                createTime: '2023-01-30',
            },
            {
                id: '2-2',
                name: '孙七',
                age: 27,
                address: '上海市黄浦区',
                email: 'sunqi@company.com',
                phone: '13800138005',
                createTime: '2023-02-05',
                children: [
                    {
                        id: '2-2-1',
                        name: '子项目Gamma',
                        age: 0,
                        address: '研发中心',
                        email: 'gamma@company.com',
                        phone: '021-33333333',
                        createTime: '2023-03-01',
                    },
                ],
            },
        ],
    },
    {
        id: '3',
        name: '部门C',
        age: 0,
        address: '研发中心',
        email: 'dept-c@company.com',
        phone: '0755-12345678',
        createTime: '2023-01-03',
        children: [
            {
                id: '3-1',
                name: '周八',
                age: 35,
                address: '深圳市南山区',
                email: 'zhouba@company.com',
                phone: '13800138006',
                createTime: '2023-02-10',
            },
        ],
    },
    {
        id: '4',
        name: '部门D',
        age: 0,
        address: '销售中心',
        email: 'dept-d@company.com',
        phone: '0755-87654321',
        createTime: '2023-01-04',
        children: [
            {
                id: '4-1',
                name: '吴九',
                age: 29,
                address: '广州市天河区',
                email: 'wujiu@company.com',
                phone: '13800138007',
                createTime: '2023-02-15',
            },
        ],
    },
]

const Basic: React.FC = () => {
    const { t } = useTranslation()
    const { queryTableData, dataSource, loading, onPageChange, onPageSizeChange, pagination } = useTable(
        apiClient.getTableData,
    )

    // 添加状态来控制是否使用树型数据
    const [useTreeData, setUseTreeData] = useState(false)

    const columns = [
        {
            title: 'Name',
            accessorKey: 'name',
            cell: ({ getValue }: any) => <span>{getValue()}</span>,
            enableSorting: true,
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
            enableSorting: true,
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
            <div className="wrapper mb-10">
                <div className="flex gap-4 items-center">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        onClick={() => setUseTreeData(!useTreeData)}
                    >
                        {useTreeData ? '切换到普通表格' : '切换到树型表格'}
                    </button>
                    <span className="text-gray-600">当前模式: {useTreeData ? '树型表格' : '普通表格'}</span>
                </div>
            </div>
            <div className="wrapper">
                <AiiTablePro
                    data={useTreeData ? treeData : (dataSource as any[])}
                    columns={columns}
                    loading={loading}
                    pagination={{
                        ...pagination,
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
                                if (useTreeData) {
                                    console.log('Refresh tree data')
                                } else {
                                    queryTableData()
                                }
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

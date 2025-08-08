import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Form, Input, Tooltip, Modal } from 'antd'
import type { TableColumnsType, TableProps } from 'antd'

import { DataType } from '@/interface/table'
import { getTableData } from '@/api/mock'
import useTable from '@/hooks/table.hooks'
import AiiTable from '@/components/AiiTable'
import AiiSearch from '@/components/AiiSearch'
import { useModal } from '@/hooks/modal.hooks'
import { useDrawer } from '@/components/AiiDrawer'
import { DownloadFour, Filter, Newlybuild, Refresh } from '@icon-park/react'

export const Route = createFileRoute('/_authentication/table/advanced')({
    component: () => <Advanced />,
    staticData: {
        code: 'Advanced_Table',
        langCode: 'Menu.Advanced_Table',
    },
})

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']

const modalTypeEnums: string[] = ['create', 'edit']

const Advanced: React.FC = () => {
    const { t } = useTranslation()

    const { showDrawer } = useDrawer()

    const {
        queryTableData,
        dataSource,
        loading,
        onPageChange,
        onPageSizeChange,
        pagination,
        selectedRowKeys,
        selectedRows,
        onSelectChange,
        onSearch,
    } = useTable(getTableData)

    const modal = useModal(modalTypeEnums)

    const rowSelection: TableRowSelection<DataType> = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const toolbar = [
        {
            icon: <Newlybuild />,
            label: t('Action.Create'),
            onClick: () => {
                modal.create.openModal({
                    title: '创建',
                    content: <div>123</div>,
                    onOk: () => {
                        console.log('onOk')
                        modal.create.closeModal()
                    },
                    onCancel: () => {
                        console.log('onCancel')
                        modal.create.closeModal()
                    },
                })
            },
        },
        {
            icon: <DownloadFour />,
            label: t('Action.Export'),
            onClick: () => {
                console.log('Export')
                window.$message.success('Export success')
                window.$modal.confirm({
                    title: 'Export',
                    content: 'Export success',
                    onOk: () => {
                        console.log('onOk')
                    },
                    onCancel: () => {
                        console.log('onCancel')
                    },
                })
                window.$notification.success({
                    message: 'Export success',
                    description: 'Export success',
                })
            },
        },
        {
            icon: <Refresh />,
            label: t('Action.Refresh'),
            onClick: () => {
                console.log('Refresh')
            },
        },
        {
            icon: <Filter />,
            label: t('Action.Filter'),
            onClick: () => {
                console.log('Filter')
            },
        },
    ]

    const onOperationClick = (key: string, record: any) => {
        switch (key) {
            case 'EDIT':
                modal.edit.openModal({
                    title: '编辑',
                    content: <div>123</div>,
                    onOk: () => {
                        console.log('onOk')
                        modal.edit.closeModal()
                    },
                    onCancel: () => {
                        console.log('onCancel')
                        modal.edit.closeModal()
                    },
                })
                break
            case 'DETAIL':
                showDrawer(<div>这是全局 Drawer 的内容</div>, {
                    title: 'DETAIL',
                    width: 600,
                })
                break
            case 'COPY':
                showDrawer(<div>11111</div>, {
                    title: 'COPY',
                    width: 600,
                })
                break
            case 'DELETE':
                window.$modal.confirm({
                    title: '删除',
                    content: '删除选中项',
                    onOk: () => {
                        console.log('onOk')
                    },
                    onCancel: () => {
                        console.log('onCancel')
                    },
                })
                break
            default:
                break
        }
    }

    const columns: TableColumnsType<DataType> = [
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
            width: 100,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ellipsis: false,
            render: (address) => (
                <Tooltip placement="top" title={address}>
                    <div
                        style={{
                            maxWidth: 120,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {address}
                    </div>
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
        },
        {
            title: 'Create Time',
            dataIndex: 'createTime',
            key: 'createTime',
        },
    ]

    const searchItem = [
        <Form.Item name="username">
            <Input placeholder="Name" />
        </Form.Item>,
        <Form.Item name="age">
            <Input placeholder="Age" />
        </Form.Item>,
        <Form.Item name="address">
            <Input placeholder="Address" />
        </Form.Item>,
        <Form.Item name="email">
            <Input placeholder="Email" />
        </Form.Item>,
        <Form.Item name="phone">
            <Input placeholder="Phone" />
        </Form.Item>,
        <Form.Item name="mobile">
            <Input placeholder="Mobile" />
        </Form.Item>,
        <Form.Item name="createTime">
            <Input placeholder="Create Time" />
        </Form.Item>,
        <Form.Item name="status">
            <Input placeholder="Status" />
        </Form.Item>,
        <Form.Item name="birthday">
            <Input placeholder="Birthday" />
        </Form.Item>,
    ]

    const onBatchDelete = () => {
        console.log('onBatchDelete', selectedRows)
    }

    const onBatchExport = () => {
        console.log('onBatchExport', selectedRows)
    }

    useEffect(() => {
        queryTableData()
    }, [])

    return (
        <>
            <AiiSearch items={searchItem} onSearch={onSearch} />
            <div className="wrapper">
                <AiiTable
                    rowKey="id"
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={pagination}
                    toolbar={toolbar}
                    operations={['EDIT', 'COPY', 'DETAIL', 'DELETE']}
                    onPageSizeChange={onPageSizeChange}
                    onPageChange={onPageChange}
                    rowSelection={rowSelection}
                    onBatchDelete={onBatchDelete}
                    onBatchExport={onBatchExport}
                    onOperationClick={onOperationClick}
                />
            </div>
            {modalTypeEnums?.length &&
                modalTypeEnums.map((type) => (
                    <Modal key={type} open={modal[type].isOpen} {...modal[type].modalOptions} />
                ))}
        </>
    )
}

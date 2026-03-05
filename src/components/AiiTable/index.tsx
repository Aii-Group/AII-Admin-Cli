import React, { memo, useEffect, useMemo, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Button, Divider, Dropdown, Pagination, Space, Table, type MenuProps, type TableProps } from 'antd'

import { Copy, Delete, DocDetail, Down, FileEditingOne, MoreOne } from '@icon-park/react'

export interface BatchOperationItemProps {
    key: string
    icon?: React.ReactNode
    label: string | React.ReactNode
    danger?: boolean
    onClick: () => void
}

export interface ToolbarProps {
    icon: React.ReactNode
    label: string
    onClick: () => void
}

export interface OperationColumnProps {
    title: string
    key: string
    render: (record: any) => React.ReactNode
    fixed?: 'left' | 'right'
    width?: number | string
}

export interface OperationItemProps {
    key: string
    icon?: React.ReactNode
    label: string | React.ReactNode
    danger?: boolean
    [key: `data-${string}`]: string | number
}

export interface AiiTableProps<T> extends TableProps<T> {
    pagination?: {
        total: number
        current: number
        pageSize: number
    }
    toolbar?: ToolbarProps[]
    operations?:
        | ('EDIT' | 'DELETE' | 'COPY' | 'DETAIL' | { key: string; icon?: React.ReactNode; label: string })[]
        | ((
              record: T,
          ) => ('EDIT' | 'DELETE' | 'COPY' | 'DETAIL' | { key: string; icon?: React.ReactNode; label: string })[])
    onPageSizeChange?: (pageSize: number) => void
    onPageChange?: (page: number) => void
    batchOperations?: BatchOperationItemProps[]
    onOperationClick?: (key: string, record: any) => void
}

export interface BatchOperationRowProps {
    selectedCount: number
    columnsLength: number
    onDeselect: () => void
    batchOperations?: BatchOperationItemProps[]
    t: (key: string) => string
}

const pageSizeOptions: System.Enum[] = [
    {
        key: '10',
        label: '10',
    },
    {
        key: '20',
        label: '20',
    },
    {
        key: '50',
        label: '50',
    },
    {
        key: '100',
        label: '100',
    },
]

const thStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 0,
    zIndex: 1,
}

const AiiTable = <T extends unknown>(props: AiiTableProps<T>): React.ReactElement => {
    const { t } = useTranslation()

    const {
        rowKey,
        loading,
        columns,
        dataSource,
        pagination,
        toolbar,
        operations,
        batchOperations,
        onPageSizeChange,
        onPageChange,
        rowSelection,
        onOperationClick,
    } = props

    const hasPagination = !!pagination

    const defaultOperationMenu: OperationItemProps[] = [
        {
            key: 'DETAIL',
            icon: <DocDetail />,
            label: t('Action.Detail'),
        },
        {
            key: 'EDIT',
            icon: <FileEditingOne />,
            label: t('Action.Edit'),
        },
        {
            key: 'COPY',
            icon: <Copy />,
            label: t('Action.Copy'),
        },
        {
            key: 'DELETE',
            icon: <Delete />,
            label: t('Action.Delete'),
            danger: true,
        },
    ]

    const [tableColumns, setTableColumns] = useState<TableProps<T>['columns']>([])

    const onMenuClick = (record: any) => {
        const onClick: MenuProps['onClick'] = ({ key }) => {
            onOperationClick && onOperationClick(key, record)
        }
        return onClick
    }

    const operationColumn: OperationColumnProps = {
        title: t('Action.Operate'),
        key: 'operation',
        render: (record: any) => {
            let menu: OperationItemProps[] = []
            if (typeof operations === 'function') {
                menu = (operations as any)(record)
                    .map((op: any) =>
                        typeof op === 'string'
                            ? defaultOperationMenu?.find((item) => item?.key === op.toUpperCase())
                            : { key: op.key, icon: op.icon, label: op.label },
                    )
                    .filter((item: any) => !!item)
            } else if (Array.isArray(operations)) {
                menu = operations
                    .map((op) =>
                        typeof op === 'string'
                            ? defaultOperationMenu?.find((item) => item?.key === op.toUpperCase())
                            : { key: op.key, icon: op.icon, label: op.label },
                    )
                    .filter((item) => !!item)
            }
            if (!menu || menu.length === 0) return null
            if (menu.length > 2) {
                return (
                    <Dropdown
                        menu={{
                            items: menu,
                            onClick: onMenuClick(record),
                        }}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <MoreOne />
                            </Space>
                        </a>
                    </Dropdown>
                )
            }
            return (
                <Space>
                    {menu.map((item) => (
                        <Button
                            key={item?.key}
                            type="text"
                            danger={item?.danger}
                            icon={item?.icon}
                            onClick={() => onOperationClick && onOperationClick(item.key, record)}
                        >
                            {item?.label}
                        </Button>
                    ))}
                </Space>
            )
        },
        fixed: 'right',
        width: 100,
    }

    const pageSizeChanged = (pageSize: number) => {
        onPageSizeChange?.(pageSize)
    }

    const onChange = (page: number) => {
        onPageChange?.(page)
    }

    const onDeselect = () => {
        rowSelection && rowSelection.onChange && rowSelection.onChange([], [], { type: 'none' })
    }

    const BatchOperationRow = memo(
        ({ selectedCount, columnsLength, onDeselect, batchOperations, t }: BatchOperationRowProps) => {
            const isVisible = selectedCount > 0
            // 表格列数依赖于是否启用操作列，如果启用了操作列，会重新计算表格列数，导致每次勾选或取消勾选时都会重新渲染，导致表格闪烁
            // 因此，为避免表格闪烁，不依赖于表格列数，而是根据是否启用操作列来计算表格列数
            const computeColumnsLength = operations && operations?.length > 0 ? columnsLength + 1 : columnsLength

            const leftThStyle = useMemo(() => ({ ...thStyle, position: 'sticky' as const, left: 0 }), [])
            const middleThStyle = useMemo(() => ({ ...thStyle, zIndex: 0 }), [])
            const rightThStyle = useMemo(() => ({ ...thStyle, position: 'sticky' as const, right: 0 }), [])

            const content = useMemo(() => {
                if (!isVisible) return null
                if (computeColumnsLength <= 4) {
                    return (
                        <th
                            style={thStyle}
                            colSpan={computeColumnsLength + 1}
                            className="!bg-white dark:!bg-dark-colorBgContainer"
                        >
                            <div className="w-full h-64 grid items-center bg-light-colorPrimaryBg dark:bg-dark-colorPrimaryBg">
                                <div className="flex items-center gap-16 px-10 w-1/2">
                                    <div>{`${t('Common.Choosed')}: ${selectedCount}`}</div>
                                    <Button className="primary-text-btn" type="text" onClick={onDeselect}>
                                        {t('Action.Uncheck')}
                                    </Button>
                                </div>
                                <div className="flex justify-end px-10 w-1/2">
                                    {batchOperations?.map((item) => (
                                        <Button
                                            key={item.key}
                                            className={item.danger ? 'error-text-btn' : 'primary-text-btn'}
                                            type="text"
                                            icon={item.icon}
                                            onClick={item.onClick}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </th>
                    )
                } else {
                    return (
                        <>
                            <th colSpan={3} style={leftThStyle} className="!bg-white dark:!bg-dark-colorBgContainer">
                                <div className="h-64 grid items-center bg-light-colorPrimaryBg dark:bg-dark-colorPrimaryBg">
                                    <div className="flex items-center gap-16 px-10">
                                        <div>{`${t('Common.Choosed')}: ${selectedCount}`}</div>
                                        <Button className="primary-text-btn" type="text" onClick={onDeselect}>
                                            {t('Action.Uncheck')}
                                        </Button>
                                    </div>
                                </div>
                            </th>
                            <th
                                colSpan={computeColumnsLength - 5}
                                style={middleThStyle}
                                className="ant-table-cell !bg-white dark:!bg-dark-colorBgContainer"
                            >
                                <div className="h-64 grid items-center bg-light-colorPrimaryBg dark:bg-dark-colorPrimaryBg" />
                            </th>
                            <th colSpan={3} style={rightThStyle} className="!bg-white dark:!bg-dark-colorBgContainer">
                                <div className="h-64 grid items-center bg-light-colorPrimaryBg dark:bg-dark-colorPrimaryBg">
                                    <div className="text-right px-10">
                                        {batchOperations?.map((item) => (
                                            <Button
                                                key={item.key}
                                                className={item.danger ? 'error-text-btn' : 'primary-text-btn'}
                                                type="text"
                                                icon={item.icon}
                                                onClick={item.onClick}
                                            >
                                                {item.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </th>
                        </>
                    )
                }
            }, [isVisible, batchOperations])

            return (
                <tr className="batch-operation-tr" style={{ height: isVisible ? 'auto' : 0, overflow: 'hidden' }}>
                    {content}
                </tr>
            )
        },
    )

    const batchOperationsHeader = useMemo(
        () => ({
            header: {
                wrapper: (props: any) => {
                    const selectedRowKeys = rowSelection?.selectedRowKeys || []
                    const columnsLength = columns?.length || 0
                    return (
                        <thead {...props}>
                            {props.children}
                            <BatchOperationRow
                                selectedCount={selectedRowKeys.length}
                                columnsLength={columnsLength}
                                onDeselect={onDeselect}
                                batchOperations={batchOperations}
                                t={t}
                            />
                        </thead>
                    )
                },
            },
        }),
        [rowSelection, batchOperations],
    )

    useEffect(() => {
        setTableColumns(columns)
    }, [columns])

    useEffect(() => {
        if (operations?.length) {
            columns?.push(operationColumn)
        }
    }, [operations])

    return (
        <>
            <div className="flex items-center justify-end gap-10 mb-10">
                {toolbar?.length &&
                    toolbar.map((tool, index) => (
                        <Button key={index} type="text" icon={tool.icon} onClick={tool.onClick}>
                            {tool.label}
                        </Button>
                    ))}
            </div>
            <Table
                loading={loading}
                components={batchOperationsHeader}
                rowKey={rowKey}
                pagination={false}
                columns={tableColumns}
                dataSource={dataSource}
                rowSelection={rowSelection}
                scroll={{ x: 'max-content' }}
                sticky={{ offsetHeader: 0 }}
            />
            {hasPagination && (
                <div className="mt-10 flex items-center justify-between">
                    <div className="flex items-center">
                        <Dropdown
                            menu={{
                                items: pageSizeOptions,
                                selectable: true,
                                defaultSelectedKeys: [pagination?.pageSize.toString()],
                                onClick: ({ key }) => {
                                    pageSizeChanged(parseInt(key))
                                },
                            }}
                            popupRender={(menu) => <div className="text-center">{menu}</div>}
                        >
                            <div className="flex items-center cursor-pointer">
                                <span>{`${t('Common.PageSize_show')}: ${pagination?.pageSize}`}</span>
                                <Down />
                            </div>
                        </Dropdown>
                        <Divider vertical />
                        <span>{`${t('Common.Total')}: ${pagination?.total}`}</span>
                    </div>
                    <Pagination
                        simple={{ readOnly: true }}
                        showSizeChanger={false}
                        current={pagination?.current}
                        pageSize={pagination?.pageSize}
                        total={pagination?.total}
                        onChange={(page) => onChange(page)}
                    />
                </div>
            )}
        </>
    )
}
export default AiiTable

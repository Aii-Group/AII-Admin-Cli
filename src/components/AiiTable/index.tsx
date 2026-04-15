import React, { memo, useCallback, useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import { Button, Divider, Dropdown, Pagination, Space, Table, type MenuProps, type TableProps } from 'antd'

import { Down, MoreOne } from '@icon-park/react'

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
    render: (record: unknown) => React.ReactNode
    fixed?: 'left' | 'right'
    width?: number | string
}
export interface OperationButtonItem<T = unknown> {
    key: string
    icon?: React.ReactNode
    label: string | React.ReactNode
    danger?: boolean
    onClick: (record: T) => void
}

export interface AiiTableProps<T> extends TableProps<T> {
    pagination?: {
        total: number
        current: number
        pageSize: number
    }
    toolbar?: ToolbarProps[]
    operations?: OperationButtonItem<T>[] | ((record: T) => OperationButtonItem<T>[])
    onPageSizeChange?: (pageSize: number) => void
    onPageChange?: (page: number) => void
    batchOperations?: BatchOperationItemProps[]
}

export interface BatchOperationRowProps {
    selectedCount: number
    columnsLength: number
    onDeselect: () => void
    batchOperations?: BatchOperationItemProps[]
    t: (key: string) => string
    hasOperations: boolean
}

const pageSizeOptions: MenuProps['items'] = [
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
] as const

const thStyle = {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 0,
    zIndex: 1,
} as const

const leftThStyleSticky = { ...thStyle, position: 'sticky' as const, left: 0 }
const middleThStyleZ = { ...thStyle, zIndex: 0 }
const rightThStyleSticky = { ...thStyle, position: 'sticky' as const, right: 0 }

const BatchOperationRow = memo(
    ({
        selectedCount,
        columnsLength,
        onDeselect,
        batchOperations,
        t,
        hasOperations: hasOpCol,
    }: BatchOperationRowProps) => {
        const isVisible = selectedCount > 0
        // 表格列数依赖于是否启用操作列，如果启用了操作列，会重新计算表格列数，导致每次勾选或取消勾选时都会重新渲染，导致表格闪烁
        // 因此，为避免表格闪烁，不依赖于表格列数，而是根据是否启用操作列来计算表格列数
        const computeColumnsLength = hasOpCol ? columnsLength + 1 : columnsLength

        const content = useMemo(() => {
            if (!isVisible) return null
            if (computeColumnsLength <= 4) {
                return (
                    <th
                        style={thStyle}
                        colSpan={computeColumnsLength + 1}
                        className="dark:bg-colorBgContainer! bg-white!"
                    >
                        <div className="bg-colorPrimaryBg grid h-15 w-full items-center">
                            <div className="flex w-1/2 flex-row items-center gap-4 px-2.5">
                                <div>{`${t('Common.Choosed')}: ${selectedCount}`}</div>
                                <Button className="primary-text-btn" type="text" onClick={onDeselect}>
                                    {t('Action.Uncheck')}
                                </Button>
                            </div>
                            <div className="flex w-1/2 justify-end px-2.5">
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
            }
            return (
                <>
                    <th colSpan={3} style={leftThStyleSticky} className="dark:bg-colorBgContainer! bg-white!">
                        <div className="bg-colorPrimaryBg grid h-15 items-center">
                            <div className="flex items-center gap-4 px-2.5">
                                <div>{`${t('Common.Choosed')}: ${selectedCount}`}</div>
                                <Button className="primary-text-btn" type="text" onClick={onDeselect}>
                                    {t('Action.Uncheck')}
                                </Button>
                            </div>
                        </div>
                    </th>
                    <th
                        colSpan={computeColumnsLength - 5}
                        style={middleThStyleZ}
                        className="ant-table-cell dark:bg-colorBgContainer! bg-white!"
                    >
                        <div className="bg-colorPrimaryBg grid h-15 items-center" />
                    </th>
                    <th colSpan={3} style={rightThStyleSticky} className="dark:bg-colorBgContainer! bg-white!">
                        <div className="bg-colorPrimaryBg grid h-15 items-center">
                            <div className="flex justify-end px-2.5">
                                {batchOperations?.map((item) => (
                                    <Button
                                        key={item.key}
                                        danger={item.danger}
                                        type="text"
                                        icon={item.icon}
                                        onClick={() => item.onClick()}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </th>
                </>
            )
        }, [isVisible, batchOperations, computeColumnsLength, selectedCount, onDeselect, t])

        return (
            <tr className="batch-operation-tr" style={{ height: isVisible ? 'auto' : 0, overflow: 'hidden' }}>
                {content}
            </tr>
        )
    },
)

export default function AiiTable<T>(props: AiiTableProps<T>): React.ReactElement {
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
    } = props

    const hasToolbar = !!toolbar && toolbar?.length > 0
    const hasPagination = !!pagination

    const Toolbar = useMemo(() => {
        return (
            <div className="mb-2.5 flex items-center justify-end gap-1">
                {toolbar?.length &&
                    toolbar.map((tool, index) => (
                        <Button key={index} type="text" icon={tool.icon} onClick={tool.onClick}>
                            {tool.label}
                        </Button>
                    ))}
            </div>
        )
    }, [toolbar])

    const hasOperations = useMemo(
        () => typeof operations === 'function' || (Array.isArray(operations) && operations.length > 0),
        [operations],
    )

    const operationColumn = useMemo((): OperationColumnProps => {
        return {
            title: t('Action.Operate'),
            key: 'operation',
            render: (record: unknown) => {
                const row = record as T
                let menu: OperationButtonItem<T>[] = []
                if (typeof operations === 'function') {
                    menu = operations(row)
                } else if (Array.isArray(operations)) {
                    menu = operations
                }
                if (!menu.length) return null
                if (menu.length > 2) {
                    return (
                        <Dropdown
                            menu={{
                                items: menu.map((item) => ({
                                    key: item.key,
                                    icon: item.icon,
                                    label: item.label,
                                    danger: item.danger,
                                    onClick: () => item.onClick(row),
                                })),
                            }}
                        >
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <Button type="text" icon={<MoreOne />} />
                                </Space>
                            </a>
                        </Dropdown>
                    )
                }
                return (
                    <Space>
                        {menu.map((item) => (
                            <Button
                                key={item.key}
                                type="text"
                                danger={item.danger}
                                icon={item.icon}
                                onClick={() => item.onClick(row)}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Space>
                )
            },
            fixed: 'right',
            width: 100,
        }
    }, [t, operations])

    const mergedColumns = useMemo((): TableProps<T>['columns'] => {
        const base = columns ? [...columns] : []
        if (hasOperations) {
            base.push(operationColumn as NonNullable<TableProps<T>['columns']>[number])
        }
        return base
    }, [columns, hasOperations, operationColumn])

    const pageSizeChanged = useCallback(
        (pageSize: number) => {
            onPageSizeChange?.(pageSize)
        },
        [onPageSizeChange],
    )

    const onChange = useCallback(
        (page: number) => {
            onPageChange?.(page)
        },
        [onPageChange],
    )

    const onDeselect = useCallback(() => {
        rowSelection?.onChange?.([], [], { type: 'none' })
    }, [rowSelection])

    const SimplePagination = useMemo(() => {
        return (
            <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center">
                    <Dropdown
                        menu={{
                            items: pageSizeOptions,
                            selectable: true,
                            defaultSelectedKeys: [pagination?.pageSize?.toString() || '10'],
                            onClick: ({ key }) => {
                                pageSizeChanged(parseInt(key))
                            },
                        }}
                        popupRender={(menu) => <div className="text-center">{menu}</div>}
                    >
                        <div className="flex cursor-pointer items-center">
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
        )
    }, [pagination, t, pageSizeChanged, onChange])

    const batchOperationsHeader = useMemo(
        () => ({
            header: {
                wrapper: (props: React.ComponentProps<'thead'>) => {
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
                                hasOperations={hasOperations}
                            />
                        </thead>
                    )
                },
            },
        }),
        [rowSelection, columns, batchOperations, hasOperations, onDeselect, t],
    )

    return (
        <div className="aii-table">
            {hasToolbar && Toolbar}
            <Table
                loading={loading}
                components={batchOperationsHeader}
                rowKey={rowKey}
                pagination={false}
                columns={mergedColumns}
                dataSource={dataSource}
                rowSelection={rowSelection}
                scroll={{ x: 'max-content' }}
                sticky={{ offsetHeader: 0 }}
            />
            {hasPagination && SimplePagination}
        </div>
    )
}

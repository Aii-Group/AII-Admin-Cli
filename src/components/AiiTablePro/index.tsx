import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Checkbox, Divider, Dropdown, Empty, Spin, Tooltip } from 'antd'

import { Down, Left, MoreOne, Right } from '@icon-park/react'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import {
    ColumnFiltersState,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    RowSelectionState,
    SortingState,
    Table,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table'

import { AiiTableProProps, AiiTableProRef, TableData } from './AiiTablePro.types'

import './index.css'

const PageSizeOptions = [10, 20, 30, 40, 50]

const AiiTablePro = memo(
    forwardRef<AiiTableProRef, AiiTableProProps<TableData>>(
        (
            {
                data = [],
                columns,
                loading = false,
                pagination = { current: 1, pageSize: 10, total: 0 },
                rowSelection,
                toolbar = [],
                operations = [],
                className = '',
                style = {},
                sticky = true,
                onSortingChange,
                onColumnFiltersChange,
                onGlobalFilterChange,
                onRowSelectionChange,
                onExpandedChange,
                onRefresh,
            },
            ref,
        ) => {
            const { t } = useTranslation()
            // 内部状态
            const [sorting, setSorting] = useState<SortingState>([])
            const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
            const [globalFilter, setGlobalFilter] = useState('')
            const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({})
            const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
            const [expanded, setExpanded] = useState<ExpandedState>({})

            // 引用
            const tableContainerRef = useRef<HTMLDivElement>(null)
            const tableHeaderRef = useRef<HTMLDivElement>(null)

            const [paginationState, setPaginationState] = useState<PaginationState>({
                pageIndex: pagination ? (pagination.current || 1) - 1 : 0,
                pageSize: pagination ? pagination.pageSize || 10 : 10,
            })

            // 处理列定义
            const processedColumns = useMemo(() => {
                const cols: any[] = [...columns]

                // 处理每列的 ellipsis 配置
                cols.forEach((col) => {
                    if (col.ellipsis) {
                        const originalCell = col.cell
                        col.cell = ({ getValue, row, column }: any) => {
                            const value = getValue()
                            const displayValue = originalCell ? originalCell({ getValue, row, column }) : value

                            if (col.ellipsis) {
                                return (
                                    <Tooltip title={displayValue} placement="topLeft">
                                        <div className="aii-table-cell-ellipsis" title={String(value || '')}>
                                            {displayValue}
                                        </div>
                                    </Tooltip>
                                )
                            }

                            return displayValue
                        }
                    }
                })

                // 添加行选择列
                if (rowSelection?.enabled) {
                    const selectionColumn = {
                        id: 'select',
                        header: ({ table }: { table: Table<TableData> }) => (
                            <Checkbox
                                checked={table.getIsAllRowsSelected()}
                                indeterminate={table.getIsSomeRowsSelected()}
                                onChange={(e) => {
                                    table.toggleAllRowsSelected(e.target.checked)
                                }}
                            />
                        ),
                        cell: ({ row }: { row: any }) => (
                            <Checkbox
                                checked={row.getIsSelected()}
                                onChange={(e) => {
                                    row.toggleSelected(e.target.checked)
                                }}
                            />
                        ),
                        enableSorting: false,
                        enableColumnFilter: false,
                    }
                    cols.unshift(selectionColumn)
                }

                // 添加操作列
                if (operations && operations.length > 0) {
                    const operationColumn = {
                        id: 'operations',
                        header: t('Action.Operate'),
                        cell: ({ row }: { row: any }) => {
                            return (
                                <div className="aii-table-cell-operations">
                                    {operations && operations.length < 3 ? (
                                        operations?.map((operation) => (
                                            <Button
                                                key={operation.key}
                                                type={operation.type || 'text'}
                                                danger={operation.danger}
                                                icon={operation.icon}
                                                onClick={() => operation.onClick?.(row.original)}
                                            >
                                                {operation.label}
                                            </Button>
                                        ))
                                    ) : (
                                        <Dropdown
                                            menu={{
                                                items: operations.map((operation) => ({
                                                    key: operation.key,
                                                    danger: operation.danger,
                                                    icon: operation.icon,
                                                    label: operation.label,
                                                    onClick: () => operation.onClick?.(row.original),
                                                })),
                                            }}
                                        >
                                            <Button type="text" icon={<MoreOne />} />
                                        </Dropdown>
                                    )}
                                </div>
                            )
                        },
                        enableSorting: false,
                        enableColumnFilter: false,
                    }
                    cols.push(operationColumn)
                }

                return cols
            }, [columns, rowSelection?.enabled])

            // 创建表格实例
            const table = useReactTable({
                data,
                columns: processedColumns,
                state: {
                    sorting,
                    columnFilters,
                    globalFilter,
                    rowSelection: rowSelectionState,
                    columnVisibility,
                    pagination: paginationState,
                    expanded,
                },
                onSortingChange: setSorting,
                onColumnFiltersChange: setColumnFilters,
                onGlobalFilterChange: setGlobalFilter,
                onRowSelectionChange: setRowSelectionState,
                onColumnVisibilityChange: setColumnVisibility,
                onPaginationChange: setPaginationState,
                onExpandedChange: setExpanded,
                getCoreRowModel: getCoreRowModel(),
                getSortedRowModel: getSortedRowModel(),
                getFilteredRowModel: getFilteredRowModel(),
                getPaginationRowModel: getPaginationRowModel(),
                getExpandedRowModel: getExpandedRowModel(),
                manualPagination: !!pagination,
                pageCount: pagination ? Math.ceil((pagination.total || 0) / paginationState.pageSize) : -1,
            })

            // 同步外部状态变化
            useEffect(() => {
                onSortingChange?.(sorting)
            }, [sorting, onSortingChange])

            useEffect(() => {
                onColumnFiltersChange?.(columnFilters)
            }, [columnFilters, onColumnFiltersChange])

            useEffect(() => {
                onGlobalFilterChange?.(globalFilter)
            }, [globalFilter, onGlobalFilterChange])

            useEffect(() => {
                const selectedRowKeys = Object.keys(rowSelectionState)
                const selectedRows = Array.isArray(data)
                    ? data.filter((_, index) => selectedRowKeys.includes(index.toString()))
                    : []
                onRowSelectionChange?.(selectedRowKeys, selectedRows)
            }, [rowSelectionState, data, onRowSelectionChange])

            useEffect(() => {
                onExpandedChange?.(Object.keys(expanded))
            }, [expanded, onExpandedChange])

            const handlePageChange = useCallback(
                (page: number, pageSize?: number) => {
                    const newPageSize = pageSize || paginationState.pageSize
                    const newPagination = {
                        pageIndex: page - 1,
                        pageSize: newPageSize,
                    }

                    setPaginationState(newPagination)

                    if (pagination && typeof pagination === 'object' && pagination.onPageChange) {
                        pagination.onPageChange(page, newPageSize)
                    }
                },
                [paginationState.pageSize, pagination],
            )

            const handlePageSizeChange = useCallback(
                (current: number, size: number) => {
                    const newPagination = {
                        pageIndex: 0,
                        pageSize: size,
                    }

                    setPaginationState(newPagination)

                    if (pagination && typeof pagination === 'object' && pagination.onPageSizeChange) {
                        pagination.onPageSizeChange(1, size)
                    }
                },
                [pagination],
            )

            // 分页渲染
            const renderPagination = () => {
                if (!pagination) return null

                const totalPages = Math.ceil((pagination.total || 0) / paginationState.pageSize)
                const currentPage = paginationState.pageIndex + 1

                return (
                    <div className="aii-table-pagination">
                        <div className="pagination-info">
                            <Dropdown
                                menu={{
                                    items: PageSizeOptions.map((size) => ({
                                        key: size.toString(),
                                        label: <div className="text-center">{size}</div>,
                                        onClick: () => handlePageSizeChange(1, size),
                                    })),
                                    selectable: true,
                                    defaultSelectedKeys: [paginationState.pageSize?.toString()],
                                }}
                                trigger={['hover']}
                            >
                                <div className="pagination-dropdown">
                                    <span>{`${t('Common.PageSize_show')}: ${paginationState.pageSize || 10}`}</span>
                                    <Down />
                                </div>
                            </Dropdown>
                            <Divider type="vertical" />
                            <span>{`${t('Common.Total')}: ${pagination.total || 0}`}</span>
                        </div>
                        <div className="pagination-controls">
                            <Button
                                type="text"
                                disabled={currentPage <= 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                icon={<Left />}
                            />
                            <span className="aii-table-pagination-current">
                                {currentPage} / {totalPages}
                            </span>
                            <Button
                                type="text"
                                disabled={currentPage >= totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                icon={<Right />}
                            />
                        </div>
                    </div>
                )
            }

            // 工具栏渲染
            const renderToolbar = () => {
                if (!toolbar?.length) return null

                return (
                    <div className="aii-table-toolbar">
                        <div className="toolbar-left"></div>
                        <div className="toolbar-right">
                            {toolbar?.map((action) => (
                                <Button
                                    key={action.key}
                                    type={action.type}
                                    color={action.color ?? 'default'}
                                    variant={action.variant ?? 'filled'}
                                    icon={action.icon}
                                    onClick={action.onClick}
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                )
            }

            // 批量操作行渲染
            const renderBatchOperationRow = () => {
                const selectedRowKeys = Object.keys(rowSelectionState)
                const showBatchOperationRow =
                    !rowSelection?.enabled || selectedRowKeys.length === 0 || !rowSelection.batchActions
                return (
                    <motion.div
                        initial={false}
                        animate={!showBatchOperationRow ? { padding: '10px 0' } : { padding: '0' }}
                        transition={{ ease: 'easeInOut', duration: 0.3 }}
                        style={{
                            overflow: 'hidden',
                            position: 'sticky',
                            top: 55,
                            zIndex: 11,
                        }}
                        className="aii-table-batch-operation-row-container"
                    >
                        <motion.div
                            initial={false}
                            animate={
                                !showBatchOperationRow
                                    ? { height: '55px', opacity: 1, padding: '16px 12px' }
                                    : { height: 0, opacity: 0, padding: '0' }
                            }
                            transition={{ ease: 'easeInOut', duration: 0.3 }}
                            className="aii-table-batch-operation-row"
                        >
                            <div className="aii-table-batch-info">
                                <span className="mr-10">{`${t('Common.Choosed')}: ${selectedRowKeys.length}`}</span>
                                <Button
                                    className="primary-text-btn"
                                    type="text"
                                    onClick={() => setRowSelectionState({})}
                                >
                                    {t('Action.Uncheck')}
                                </Button>
                            </div>
                            <div className="aii-table-batch-actions">
                                {rowSelection?.batchActions && rowSelection?.batchActions?.length < 3 ? (
                                    rowSelection?.batchActions?.map((action) => (
                                        <Button
                                            key={action.key}
                                            type={action.type || 'text'}
                                            danger={action.danger}
                                            icon={action.icon}
                                            disabled={action.disabled}
                                            onClick={() => {
                                                const selectedRows = data.filter((_, index) =>
                                                    selectedRowKeys.includes(index.toString()),
                                                )
                                                action.onClick?.(selectedRows)
                                            }}
                                        >
                                            {action.label}
                                        </Button>
                                    ))
                                ) : (
                                    <Dropdown
                                        menu={{
                                            items: rowSelection?.batchActions?.map((action) => ({
                                                key: action.key,
                                                label: action.label,
                                                danger: action.danger,
                                                onClick: () => {
                                                    const selectedRows = data.filter((_, index) =>
                                                        selectedRowKeys.includes(index.toString()),
                                                    )
                                                    action.onClick?.(selectedRows)
                                                },
                                            })),
                                        }}
                                        trigger={['hover']}
                                    >
                                        <Button type="text" icon={<MoreOne />}>
                                            {t('Action.Batch_Operate')}
                                        </Button>
                                    </Dropdown>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )
            }

            // 表格渲染
            const renderGridTable = () => {
                const headerGroups = table.getHeaderGroups()
                const rows = table.getRowModel().rows
                const columnCount = processedColumns.length

                const hasSelection = rowSelection?.enabled
                const gridTemplateColumns = hasSelection
                    ? `48px repeat(${columnCount - 1}, 1fr)`
                    : `repeat(${columnCount}, 1fr)`

                return (
                    <div
                        ref={tableContainerRef}
                        className={`aii-table-container ${loading ? 'loading' : ''}`}
                        style={
                            {
                                '--columns': columnCount,
                                '--grid-template-columns': gridTemplateColumns,
                            } as React.CSSProperties
                        }
                    >
                        {loading && (
                            <div className="aii-table-loading-spin">
                                <Spin />
                            </div>
                        )}
                        <div ref={tableHeaderRef} className={`aii-table-header ${sticky ? 'sticky' : ''}`}>
                            {headerGroups.map((headerGroup) => (
                                <div key={headerGroup.id} className="aii-table-header-row">
                                    {headerGroup.headers.map((header) => (
                                        <div
                                            key={header.id}
                                            className="aii-table-header-cell"
                                            data-column-id={header.column.id}
                                        >
                                            <div className="aii-table-header-content">
                                                <span>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column.columnDef.header,
                                                              header.getContext(),
                                                          )}
                                                </span>
                                                {header.column.getCanSort() && (
                                                    <div className="aii-table-sort-icons">
                                                        <CaretUpOutlined
                                                            className={
                                                                header.column.getIsSorted() === 'asc'
                                                                    ? 'sort-icon active'
                                                                    : 'sort-icon'
                                                            }
                                                        />
                                                        <CaretDownOutlined
                                                            className={
                                                                header.column.getIsSorted() === 'desc'
                                                                    ? 'sort-icon active'
                                                                    : 'sort-icon'
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            {header.column.getCanSort() && (
                                                <div
                                                    className="aii-table-sort-trigger"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        {renderBatchOperationRow()}
                        <AnimatePresence mode="wait">
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: '100%' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ ease: 'easeInOut', duration: 0.3 }}
                                className="aii-table-body"
                            >
                                {rows.length === 0 ? (
                                    <div className="aii-table-empty">
                                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                    </div>
                                ) : (
                                    rows.map((row) => (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ ease: 'easeInOut', duration: 0.3 }}
                                            key={row.id}
                                            className={`aii-table-row ${row.getIsSelected() ? 'selected' : ''}`}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <div
                                                    key={cell.id}
                                                    className="aii-table-cell"
                                                    data-column-id={cell.column.id}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </div>
                                            ))}
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )
            }

            useImperativeHandle(
                ref,
                () => ({
                    getSelectedRows: () => {
                        const selectedRowKeys = Object.keys(rowSelectionState)
                        return Array.isArray(data)
                            ? data.filter((_, index) => selectedRowKeys.includes(index.toString()))
                            : []
                    },
                    getSelectedRowKeys: () => Object.keys(rowSelectionState),
                    clearSelection: () => setRowSelectionState({}),
                    selectAll: () => {
                        const allKeys = Array.isArray(data)
                            ? data.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
                            : {}
                        setRowSelectionState(allKeys)
                    },
                    refresh: () => onRefresh?.(),
                    reset: () => {
                        setSorting([])
                        setColumnFilters([])
                        setGlobalFilter('')
                        setRowSelectionState({})
                        setPaginationState({
                            pageIndex: 0,
                            pageSize: pagination && typeof pagination === 'object' ? pagination.pageSize || 10 : 10,
                        })
                    },
                }),
                [data, rowSelectionState, pagination, onRefresh],
            )

            return (
                <div className={`aii-table-pro ${className}`} style={style}>
                    {renderToolbar()}
                    {renderGridTable()}
                    {renderPagination()}
                </div>
            )
        },
    ),
)

AiiTablePro.displayName = 'AiiTablePro'

export default AiiTablePro

import React, {
    forwardRef,
    memo,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
    CSSProperties,
} from 'react'

import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { Button, Checkbox, Divider, Dropdown, Empty, Spin, Tooltip } from 'antd'

import { Down, Left, MoreOne, Right, UpOne, DownOne } from '@icon-park/react'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import {
    Column,
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
    ColumnPinningState,
} from '@tanstack/react-table'

import { AiiTableProProps, AiiTableProRef, TableData, AiiColumnDef } from './AiiTablePro.types'

import classNames from 'classnames'

import './index.css'

const PageSizeOptions = [10, 20, 30, 50, 100]

const AiiTablePro = memo(
    forwardRef<AiiTableProRef, AiiTableProProps<TableData>>(
        (
            {
                data = [],
                columns,
                loading = false,
                pagination = { current: 1, pageSize: 10, total: 0 },
                rowSelection = {},
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
            const [columnPinningState, setColumnPinningState] = useState<ColumnPinningState>({
                left: [],
                right: [],
            })

            // 引用
            const tableContainerRef = useRef<HTMLDivElement>(null)
            const tableHeaderRef = useRef<HTMLDivElement>(null)
            const tableBodyRef = useRef<HTMLDivElement>(null)

            const [paginationState, setPaginationState] = useState<PaginationState>({
                pageIndex: pagination ? (pagination.current || 1) - 1 : 0,
                pageSize: pagination ? pagination.pageSize || 10 : 10,
            })

            // 处理列定义
            const processedColumns = useMemo(() => {
                const cols: any[] = [...columns]
                const left: string[] = ['select']
                const right: string[] = ['operations']

                // 处理自定义配置
                cols.forEach((col) => {
                    // 设置默认的 enableSorting 为 false
                    if (col.enableSorting === undefined) {
                        col.enableSorting = false
                    }

                    // 处理 ellipsis 配置
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
                    // 处理固定列配置
                    if (col.fixed) {
                        if (col.fixed === 'left') {
                            left.push(col.accessorKey)
                        }
                        if (col.fixed === 'right') {
                            right.push(col.accessorKey)
                        }
                        setColumnPinningState({
                            left,
                            right,
                        })
                    }
                    // 处理宽度配置
                    if (col.width && !col.size) {
                        if (typeof col.width === 'number') {
                            col.size = col.width
                            col.minSize = col.width
                            col.maxSize = col.width
                        } else if (typeof col.width === 'string' && col.width.endsWith('px')) {
                            const width = parseInt(col.width.replace('px', ''))
                            col.size = width
                            col.minSize = width
                            col.maxSize = width
                        }
                    }
                    if (col.enableSorting) {
                        col.sortingFn = (a: any, b: any) => {
                            const valueA = a.getValue(col.accessorKey)
                            const valueB = b.getValue(col.accessorKey)
                            if (valueA < valueB) return -1
                            if (valueA > valueB) return 1
                            return 0
                        }
                    }
                })

                // 添加行选择列
                if (rowSelection.enabled) {
                    const selectionColumn = {
                        id: 'select',
                        size: 48,
                        minSize: 48,
                        maxSize: 48,
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
                        enableResizing: false,
                        fixed: 'left',
                    }
                    cols.unshift(selectionColumn)
                }

                // 添加操作列
                if (operations && operations.length) {
                    const operationWidth = operations.length > 2 ? 120 : 240
                    const operationColumn = {
                        id: 'operations',
                        size: operationWidth,
                        minSize: operationWidth,
                        maxSize: operationWidth,
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
                        enableResizing: false,
                        fixed: 'right',
                    }
                    cols.push(operationColumn)
                }

                return cols
            }, [columns, rowSelection?.enabled, operations, t])

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
                    columnPinning: columnPinningState,
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
                            zIndex: 'var(--z-table-batch-operation)',
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

            // 固定列阴影样式
            const getCommonPinningStyles = (column: Column<any>): CSSProperties => {
                const isPinned = column.getIsPinned()
                const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
                const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

                // 使用状态中的阴影显示标志
                const { showLeftShadow, showRightShadow } = shadowState

                let boxShadow: string | undefined = undefined
                let darkBoxShadow: string | undefined = undefined
                if (isLastLeftPinnedColumn && showLeftShadow) {
                    boxShadow = 'inset 10px 0 8px -8px rgba(0, 0, 0, 0.06)'
                    darkBoxShadow = 'inset 10px 0 8px -8px rgba(253, 253, 253, 0.12)'
                } else if (isFirstRightPinnedColumn && showRightShadow) {
                    boxShadow = 'inset -10px 0 8px -8px rgba(0, 0, 0, 0.06)'
                    darkBoxShadow = 'inset -10px 0 8px -8px rgba(253, 253, 253, 0.12)'
                }

                return {
                    '--sticky-box-shadow': boxShadow || 'none',
                    '--sticky-dark-box-shadow': darkBoxShadow || 'none',
                    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
                    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
                    position: isPinned ? 'sticky' : 'static',
                    // width: `${column.getSize()}px`,
                    zIndex: isPinned ? 80 : 1,
                    backgroundColor: isPinned ? 'inherit' : undefined,
                } as React.CSSProperties
            }

            // 表格渲染
            const renderGridTable = () => {
                const headerGroups = table.getHeaderGroups()
                const rows = table.getRowModel().rows
                const columnCount = processedColumns.length

                // 计算每列的宽度
                const getColumnWidths = () => {
                    return table
                        .getVisibleLeafColumns()
                        .map((column) => {
                            const size = column.getSize()
                            const columnDef = column.columnDef as AiiColumnDef<TableData>

                            // 对于有固定宽度的列（包括选择列、操作列和用户设置了width的列），直接返回像素值
                            if (column.id === 'select' || column.id === 'operations' || columnDef.width) {
                                return `${size}px`
                            }

                            // 对于没有设置宽度的列，使用实际的size值作为最小宽度，同时允许扩展
                            return `minmax(${size}px, 1fr)`
                        })
                        .join(' ')
                }

                const gridTemplateColumns = getColumnWidths()

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
                                            className={classNames(
                                                'aii-table-header-cell',
                                                header.column.getIsPinned() &&
                                                    `sticky-header-${header.column.getIsPinned()}`,
                                            )}
                                            data-column-id={header.column.id}
                                            style={{
                                                ...getCommonPinningStyles(header.column),
                                            }}
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
                                                            className={classNames([
                                                                'sort-up',
                                                                header.column.getIsSorted() === 'asc' && 'active',
                                                            ])}
                                                        />
                                                        <CaretDownOutlined
                                                            className={classNames([
                                                                'sort-down',
                                                                header.column.getIsSorted() === 'desc' && 'active',
                                                            ])}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            {header.column.getCanSort() && (
                                                <div
                                                    className="aii-table-sort-trigger"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        e.stopPropagation()
                                                        const handler = header.column.getToggleSortingHandler()
                                                        if (handler) {
                                                            handler(e)
                                                        }
                                                    }}
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
                                ref={tableBodyRef}
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
                                                    className={classNames(
                                                        'aii-table-cell',
                                                        cell.column.getIsPinned() &&
                                                            `sticky-${cell.column.getIsPinned()}`,
                                                    )}
                                                    data-column-id={cell.column.id}
                                                    style={{
                                                        ...getCommonPinningStyles(cell.column),
                                                    }}
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

            // 阴影状态管理
            const [shadowState, setShadowState] = useState({
                showLeftShadow: false,
                showRightShadow: false,
            })

            // 防抖函数
            const debounce = useCallback((func: Function, wait: number) => {
                let timeout: NodeJS.Timeout
                return function executedFunction(...args: any[]) {
                    const later = () => {
                        clearTimeout(timeout)
                        func(...args)
                    }
                    clearTimeout(timeout)
                    timeout = setTimeout(later, wait)
                }
            }, [])

            // 节流函数
            const throttle = useCallback((func: Function, limit: number) => {
                let inThrottle: boolean
                return function executedFunction(...args: any[]) {
                    if (!inThrottle) {
                        func(...args)
                        inThrottle = true
                        setTimeout(() => (inThrottle = false), limit)
                    }
                }
            }, [])

            // 滚动同步和固定列阴影检测 - 优化版本
            useEffect(() => {
                const tableBodyElement = tableBodyRef.current
                const tableHeaderElement = tableHeaderRef.current
                const tableContainer = tableContainerRef.current

                if (!tableBodyElement || !tableHeaderElement || !tableContainer) return

                const handleScrollAndShadow = () => {
                    const scrollLeft = tableBodyElement.scrollLeft

                    // 同步表头滚动
                    tableHeaderElement.scrollLeft = scrollLeft

                    // 检测是否需要显示固定列阴影
                    const scrollWidth = tableBodyElement.scrollWidth
                    const clientWidth = tableBodyElement.clientWidth
                    const maxScrollLeft = scrollWidth - clientWidth

                    // 左侧阴影：当向右滚动时显示
                    const showLeftShadow = scrollLeft > 0
                    // 右侧阴影：当表格内容超出容器且还能继续向右滚动时显示
                    const showRightShadow = scrollWidth > clientWidth && scrollLeft < maxScrollLeft - 1

                    // 更新阴影状态（只在状态真正改变时更新）
                    setShadowState((prev) => {
                        if (prev.showLeftShadow !== showLeftShadow || prev.showRightShadow !== showRightShadow) {
                            return { showLeftShadow, showRightShadow }
                        }
                        return prev
                    })

                    // 同时设置 DOM 属性（用于其他可能的用途）
                    tableContainer.setAttribute('data-scroll-left', showLeftShadow.toString())
                    tableContainer.setAttribute('data-scroll-right', showRightShadow.toString())
                }

                const handleResize = debounce(() => {
                    // 窗口大小变化时重新检测阴影状态
                    handleScrollAndShadow()
                }, 100)

                // 使用节流优化滚动性能
                const throttledScrollHandler = throttle(handleScrollAndShadow, 16) // 约60fps

                // 添加事件监听器 - 同时监听表头和表体的滚动
                tableBodyElement.addEventListener('scroll', throttledScrollHandler, { passive: true })
                tableHeaderElement.addEventListener('scroll', throttledScrollHandler, { passive: true })
                window.addEventListener('resize', handleResize, { passive: true })

                // 初始化检测（使用requestAnimationFrame确保DOM完全渲染）
                const initCheck = () => {
                    requestAnimationFrame(handleScrollAndShadow)
                }
                initCheck()

                return () => {
                    tableBodyElement.removeEventListener('scroll', throttledScrollHandler)
                    tableHeaderElement.removeEventListener('scroll', throttledScrollHandler)
                    window.removeEventListener('resize', handleResize)
                }
            }, [debounce, throttle]) // 移除data和columns依赖，避免频繁重新绑定

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

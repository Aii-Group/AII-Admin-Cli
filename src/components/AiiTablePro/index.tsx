import React, {
    forwardRef,
    useState,
    useMemo,
    useImperativeHandle,
    useEffect,
    memo,
    useCallback,
    useRef,
    useLayoutEffect,
} from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getExpandedRowModel,
    flexRender,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    RowSelectionState,
    PaginationState,
    ExpandedState,
    Table,
} from '@tanstack/react-table'
import { Button, Input, Select, Checkbox, Spin, Empty, Divider, Dropdown } from 'antd'
import {
    SearchOutlined,
    ReloadOutlined,
    ExportOutlined,
    LeftOutlined,
    RightOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    DownOutlined,
} from '@ant-design/icons'
import { Copy, Delete, DocDetail, Down, DownloadFour, FileEditingOne, MoreOne, Spanner } from '@icon-park/react'
import { AiiTableProProps, AiiTableProRef, AiiColumnDef, ActionItem, TableData } from './AiiTablePro.types'
import './index.css'

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
                className = '',
                style = {},
                size = 'middle',
                bordered = false,
                showHeader = true,
                resizable = false,
                expandable,
                scroll,
                sticky,
                onSortingChange,
                onColumnFiltersChange,
                onGlobalFilterChange,
                onRowSelectionChange,
                onExpandedChange,
                onRefresh,
                onExport,
                onCustomAction,
            },
            ref,
        ) => {
            // 内部状态
            const [sorting, setSorting] = useState<SortingState>([])
            const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
            const [globalFilter, setGlobalFilter] = useState('')
            const [rowSelectionState, setRowSelectionState] = useState<RowSelectionState>({})
            const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
            const [expanded, setExpanded] = useState<ExpandedState>({})

            const [paginationState, setPaginationState] = useState<PaginationState>({
                pageIndex: pagination ? (pagination.current || 1) - 1 : 0,
                pageSize: pagination ? pagination.pageSize || 10 : 10,
            })

            // 处理列定义 - 使用 useMemo 优化
            const processedColumns = useMemo(() => {
                const cols: any[] = [...columns]

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

            // 用于测量表格主体高度的 ref
            const tableBodyRef = useRef<HTMLDivElement>(null)
            const [actualTableBodyHeight, setActualTableBodyHeight] = useState<number>(0) // 默认值

            // 获取表格主体的实际高度
            const getTableBodyHeight = useCallback(() => {
                return actualTableBodyHeight
            }, [actualTableBodyHeight])

            // 测量实际表格主体高度
            useLayoutEffect(() => {
                if (tableBodyRef.current) {
                    // 使用 setTimeout 确保 DOM 已经渲染完成
                    const timer = setTimeout(() => {
                        if (tableBodyRef.current) {
                            const height = tableBodyRef.current.getBoundingClientRect().height
                            if (height > 0 && Math.abs(height - actualTableBodyHeight) > 1) {
                                // 只有当高度差异超过 1px 时才更新，避免频繁更新
                                setActualTableBodyHeight(height)
                            }
                        }
                    }, 0)

                    return () => clearTimeout(timer)
                }
            }, [data, size, columns, actualTableBodyHeight]) // 添加 columns 作为依赖项，因为列的变化也可能影响高度

            const tableBodyHeight = getTableBodyHeight()

            const handlePageChange = useCallback(
                (page: number, pageSize?: number) => {
                    const newPageSize = pageSize || paginationState.pageSize
                    const newPagination = {
                        pageIndex: page - 1,
                        pageSize: newPageSize,
                    }

                    // 先更新内部状态
                    setPaginationState(newPagination)

                    // 然后调用外部回调
                    if (pagination && typeof pagination === 'object' && pagination.onChange) {
                        console.log(page)
                        pagination.onChange(page, newPageSize)
                    }
                },
                [paginationState.pageSize, pagination],
            )

            const handlePageSizeChange = useCallback(
                (current: number, size: number) => {
                    const newPagination = {
                        pageIndex: 0, // 重置到第一页
                        pageSize: size,
                    }

                    // 先更新内部状态
                    setPaginationState(newPagination)

                    // 然后调用外部回调
                    if (pagination && typeof pagination === 'object' && pagination.onShowSizeChange) {
                        pagination.onShowSizeChange(1, size) // 传递页码 1 而不是 current
                    }
                },
                [pagination],
            )

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
                                    type={action.type || 'text'}
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

            // 分页渲染
            const renderPagination = () => {
                if (!pagination) return null

                console.log('renderCustomPagination', paginationState.pageIndex, paginationState.pageSize)

                const totalPages = Math.ceil((pagination.total || 0) / paginationState.pageSize)
                const currentPage = paginationState.pageIndex + 1

                return (
                    <div className="aii-table-pagination">
                        <div className="pagination-info">
                            <Dropdown
                                menu={{
                                    items: [10, 20, 50, 100].map((size) => ({
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
                                    <span>每页显示: {paginationState.pageSize || 10}</span>
                                    <DownOutlined />
                                </div>
                            </Dropdown>
                            <Divider type="vertical" />
                            <span>总数：{pagination.total || 0}</span>
                        </div>

                        <div className="aii-table-pagination-controls">
                            <Button
                                type="text"
                                disabled={currentPage <= 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                icon={<LeftOutlined />}
                            />
                            <span className="aii-table-pagination-current">
                                {currentPage} / {totalPages}
                            </span>
                            <Button
                                type="text"
                                disabled={currentPage >= totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                icon={<RightOutlined />}
                            />
                        </div>
                    </div>
                )
            }

            // 批量操作行渲染
            const renderBatchOperationRow = () => {
                const selectedRowKeys = Object.keys(rowSelectionState)
                if (!rowSelection?.enabled || selectedRowKeys.length === 0 || !rowSelection.batchActions) return null

                return (
                    <div className="aii-table-batch-operation-row">
                        <div className="aii-table-batch-info">
                            <span>已选择 {selectedRowKeys.length} 项</span>
                            <Divider type="vertical" />
                            <Button type="text" danger onClick={() => setRowSelectionState({})}>
                                取消选择
                            </Button>
                        </div>
                        <div className="aii-table-batch-actions">
                            {rowSelection.batchActions.map((action) => (
                                <Button
                                    key={action.key}
                                    type="text"
                                    icon={action.icon}
                                    disabled={action.disabled}
                                    onClick={() => {
                                        const selectedRows = data.filter((_, index) =>
                                            selectedRowKeys.includes(index.toString()),
                                        )
                                        action.onClick?.(selectedRows, selectedRowKeys)
                                    }}
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                )
            }

            // Grid 表格渲染
            const renderGridTable = () => {
                const headerGroups = table.getHeaderGroups()
                const rows = table.getRowModel().rows
                const columnCount = processedColumns.length

                // 动态计算 grid-template-columns
                const hasSelection = rowSelection?.enabled
                const gridTemplateColumns = hasSelection
                    ? `48px repeat(${columnCount - 1}, 1fr)`
                    : `repeat(${columnCount}, 1fr)`

                return (
                    <div
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
                        <div className="aii-table-header">
                            {table.getHeaderGroups().map((headerGroup) => (
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
                        <div ref={tableBodyRef} className="aii-table-body">
                            {rows.length === 0 ? (
                                <div className="aii-table-empty">
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                </div>
                            ) : (
                                rows.map((row) => (
                                    <div
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
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )
            }

            // 优化 useImperativeHandle 的依赖项
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

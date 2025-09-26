import React from 'react'
import type {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    RowSelectionState,
    PaginationState,
    ExpandedState,
    GroupingState,
    ColumnSizingState,
    ColumnOrderState,
    Table,
    Row,
    Cell,
    Header,
    HeaderGroup,
    Column,
    ColumnPinningState,
    OnChangeFn,
    RowData,
    TableOptions,
    Updater,
    AccessorFn,
} from '@tanstack/react-table'

// 基础数据类型
export interface TableData extends Record<string, any> {
    id?: string | number
}

// 分页配置
export interface PaginationConfig {
    current?: number
    pageSize?: number
    total?: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    showTotal?: (total: number, range: [number, number]) => React.ReactNode
    pageSizeOptions?: string[]
    size?: 'default' | 'small'
    simple?: boolean
    hideOnSinglePage?: boolean
    responsive?: boolean
    disabled?: boolean
    showLessItems?: boolean
    itemRender?: (
        page: number,
        type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next',
        originalElement: React.ReactElement,
    ) => React.ReactNode
    onChange?: (page: number, pageSize: number) => void
    onShowSizeChange?: (current: number, size: number) => void
}

// 排序配置
export interface SortingConfig {
    enabled?: boolean
    multiple?: boolean
    defaultSorting?: SortingState
    onSortingChange?: OnChangeFn<SortingState>
}

// 筛选配置
export interface FilteringConfig {
    enabled?: boolean
    globalFilter?: boolean
    columnFilters?: boolean
    defaultColumnFilters?: ColumnFiltersState
    defaultGlobalFilter?: string
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
    onGlobalFilterChange?: OnChangeFn<string>
}

// 行选择配置
export interface RowSelectionConfig<TData extends TableData = TableData> {
    enabled?: boolean
    multiple?: boolean
    type?: 'checkbox' | 'radio'
    defaultSelectedRowKeys?: string[]
    defaultSelectedRowIds?: RowSelectionState
    selectedRowKeys?: React.Key[]
    onChange?: (selectedRowKeys: React.Key[], selectedRows: TData[], info: { type: 'all' | 'none' }) => void
    onSelect?: (record: TData, selected: boolean, selectedRows: TData[], nativeEvent: Event) => void
    onSelectAll?: (selected: boolean, selectedRows: TData[], changeRows: TData[]) => void
    getCheckboxProps?: (record: TData) => { disabled?: boolean; name?: string }
    onSelectionChange?: (selectedRows: TData[], selectedRowKeys: string[]) => void
    onRowSelectionChange?: OnChangeFn<RowSelectionState>
    getRowId?: (row: TData, index: number) => string
    enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
    enableMultiRowSelection?: boolean | ((row: Row<TData>) => boolean)
    enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean)
    checkStrictly?: boolean
    preserveSelectedRowKeys?: boolean
    hideSelectAll?: boolean
    columnWidth?: number
    columnTitle?: React.ReactNode
    fixed?: boolean | 'left' | 'right'
    renderCell?: (checked: boolean, record: TData, index: number, originNode: React.ReactNode) => React.ReactNode
    batchActions?: BatchActionItem[]
}

// 列可见性配置
export interface ColumnVisibilityConfig {
    enabled?: boolean
    defaultColumnVisibility?: VisibilityState
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>
}

// 列调整大小配置
export interface ColumnResizingConfig {
    enabled?: boolean
    columnResizeMode?: 'onChange' | 'onEnd'
    defaultColumnSizing?: ColumnSizingState
    onColumnSizingChange?: OnChangeFn<ColumnSizingState>
}

// 列重排序配置
export interface ColumnOrderingConfig {
    enabled?: boolean
    defaultColumnOrder?: ColumnOrderState
    onColumnOrderChange?: OnChangeFn<ColumnOrderState>
}

// 列固定配置
export interface ColumnPinningConfig {
    enabled?: boolean
    defaultColumnPinning?: ColumnPinningState
    onColumnPinningChange?: OnChangeFn<ColumnPinningState>
}

// 行展开配置
export interface RowExpandingConfig<TData extends TableData = TableData> {
    enabled?: boolean
    defaultExpanded?: ExpandedState
    onExpandedChange?: OnChangeFn<ExpandedState>
    getRowCanExpand?: (row: Row<TData>) => boolean
    getSubRows?: (originalRow: TData, index: number) => TData[] | undefined
    renderSubComponent?: (props: { row: Row<TData> }) => React.ReactElement
}

// 行分组配置
export interface RowGroupingConfig {
    enabled?: boolean
    defaultGrouping?: GroupingState
    onGroupingChange?: OnChangeFn<GroupingState>
    enableGrouping?: boolean
    getGroupedRowModel?: any
}

// 虚拟化配置
export interface VirtualizationConfig {
    enabled?: boolean
    estimateSize?: (index: number) => number
    overscan?: number
    scrollElement?: HTMLElement | null
    horizontal?: boolean
}

// 操作项接口
export interface ActionItem {
    key: string
    label: string
    icon?: React.ReactNode
    type?: 'link' | 'text' | 'primary' | 'default' | 'dashed'
    disabled?: boolean
    onClick?: (record?: any, index?: number) => void
}

// 批量操作项接口
export interface BatchActionItem {
    key: string
    label: string
    icon?: React.ReactNode
    type?: 'default' | 'primary' | 'dashed' | 'link' | 'text'
    disabled?: boolean
    onClick?: (selectedRows: any[], selectedRowKeys: React.Key[]) => void
}

// 工具栏配置
export interface ToolbarItem {
    key: string
    icon?: React.ReactNode
    label?: string
    type?: 'link' | 'text' | 'primary' | 'default' | 'dashed'
    onClick?: (record?: any, index?: number) => void
}

// 操作列配置
export interface ActionColumnConfig<TData extends TableData = TableData> {
    enabled?: boolean
    title?: string
    width?: number | string
    fixed?: 'left' | 'right'
    actions?: Array<{
        key: string
        label: string
        type?: 'link' | 'text' | 'primary' | 'default' | 'dashed'
        icon?: React.ReactNode
        onClick: (record: TData, index: number) => void
        disabled?: boolean | ((record: TData) => boolean)
        danger?: boolean
        confirm?: {
            title: string
            content?: string
            onConfirm: (record: TData) => void
        }
    }>
    render?: (record: TData, index: number) => React.ReactNode
}

// 批量操作配置
export interface BatchOperationConfig<TData extends TableData = TableData> {
    enabled?: boolean
    actions?: Array<{
        key: string
        label: string
        icon?: React.ReactNode
        onClick: (selectedRows: TData[], selectedRowKeys: string[]) => void
        disabled?: boolean
        danger?: boolean
        confirm?: {
            title: string
            content?: string
        }
    }>
}

// 表格样式配置
export interface TableStyleConfig {
    size?: 'small' | 'middle' | 'large'
    bordered?: boolean
    striped?: boolean
    hoverable?: boolean
    sticky?: boolean | { offsetHeader?: number; offsetScroll?: number }
    scroll?: { x?: number | string | true; y?: number | string }
    tableLayout?: 'auto' | 'fixed'
    className?: string
    style?: React.CSSProperties
    headerStyle?: React.CSSProperties
    rowStyle?: React.CSSProperties | ((record: TableData, index: number) => React.CSSProperties)
    cellStyle?: React.CSSProperties | ((value: any, record: TableData, index: number) => React.CSSProperties)
    stripedRows?: boolean
    hoverEffect?: boolean
    gridLines?: boolean
    compactMode?: boolean
}

// 滚动配置
export interface ScrollConfig {
    x?: number | string | true
    y?: number | string
}

// 粘性配置
export interface StickyConfig {
    offsetHeader?: number
    offsetScroll?: number
    getContainer?: () => HTMLElement
}

// 可展开配置
export interface ExpandableConfig {
    expandedRowRender?: (record: TableData, index: number) => React.ReactNode
    expandRowByClick?: boolean
    expandIcon?: (props: any) => React.ReactNode
    onExpand?: (expanded: boolean, record: TableData) => void
    onExpandedRowsChange?: (expandedRows: React.Key[]) => void
    defaultExpandedRowKeys?: React.Key[]
    expandedRowKeys?: React.Key[]
    defaultExpandAllRows?: boolean
    indentSize?: number
    rowExpandable?: (record: TableData) => boolean
}

// 加载状态配置
export interface LoadingConfig {
    loading?: boolean
    skeleton?: boolean
    skeletonRows?: number
    skeletonColumns?: number
    loadingText?: string
    emptyText?: string
    emptyImage?: React.ReactNode
}

// 扩展的列定义
export interface AiiColumnDef<TData extends TableData = TableData, TValue = unknown>
    extends Omit<ColumnDef<TData, TValue>, 'header' | 'cell' | 'accessorFn'> {
    // 基础属性
    title?: string
    dataIndex?: keyof TData | string
    key?: string
    width?: number | string
    minWidth?: number
    maxWidth?: number

    // 显示控制
    hidden?: boolean
    ellipsis?: boolean | { showTitle?: boolean }
    copyable?: boolean

    // 排序
    sortable?: boolean
    sorter?: boolean | ((a: TData, b: TData) => number)
    sortDirections?: ('ascend' | 'descend')[]
    defaultSortOrder?: 'ascend' | 'descend'

    // 筛选
    filterable?: boolean
    filters?: Array<{ text: string; value: any }>
    filterDropdown?: React.ReactNode | ((props: any) => React.ReactNode)
    filterIcon?: React.ReactNode | ((filtered: boolean) => React.ReactNode)
    filterMultiple?: boolean
    filteredValue?: any[]
    defaultFilteredValue?: any[]
    onFilter?: (value: any, record: TData) => boolean

    // 固定
    fixed?: 'left' | 'right' | boolean

    // 渲染
    render?: (value: TValue, record: TData, index: number) => React.ReactNode
    renderHeader?: (column: Column<TData, TValue>) => React.ReactNode
    cell?: React.ReactNode | ((props: any) => React.ReactNode)
    header?: React.ReactNode | ((props: any) => React.ReactNode)
    accessorFn?: AccessorFn<TData, TValue>

    // 分组
    groupable?: boolean

    // 可调整大小
    resizable?: boolean

    // 对齐
    align?: 'left' | 'center' | 'right'

    // 样式
    className?: string
    headerClassName?: string
    cellClassName?: string | ((record: TData, index: number) => string)

    // 其他
    tooltip?: string | ((record: TData) => string)
    editable?: boolean | ((record: TData) => boolean)
    size?: number

    // 元数据
    meta?: {
        headerClassName?: string
        cellClassName?: string
        align?: 'left' | 'center' | 'right'
        [key: string]: any
    }
}

// 工具栏项接口
export interface ToolbarProps {
    icon: React.ReactNode
    label: string
    onClick: () => void
}

// 操作项接口
export interface OperationItemProps {
    key: string
    icon?: React.ReactNode
    label: string | React.ReactNode
    danger?: boolean
    [key: `data-${string}`]: string | number
}

// 批量操作行属性接口
export interface BatchOperationRowProps {
    selectedCount: number
    columnsLength: number
    onDeselect: () => void
    onBatchDelete?: () => void
    onBatchExport?: () => void
    t: (key: string) => string
}

// 表格属性接口
export interface AiiTableProProps<T extends TableData = TableData> {
    data: T[]
    columns: AiiColumnDef<T>[]
    loading?: boolean
    rowKey?: string | ((record: T) => string)

    // 分页相关
    pagination?: PaginationConfig | false

    // 工具栏
    toolbar?: ToolbarItem[]

    // 操作列
    operations?:
        | ('EDIT' | 'DELETE' | 'COPY' | 'DETAIL' | { key: string; icon?: React.ReactNode; label: string })[]
        | ((
              record: T,
          ) => ('EDIT' | 'DELETE' | 'COPY' | 'DETAIL' | { key: string; icon?: React.ReactNode; label: string })[])

    // 行选择
    rowSelection?: RowSelectionConfig<T>

    // 批量操作
    onBatchDelete?: () => void
    onBatchExport?: () => void
    onOperationClick?: (key: string, record: any) => void

    // 搜索
    searchable?: boolean
    searchPlaceholder?: string
    onSearch?: (value: string) => void

    // 其他属性
    className?: string
    style?: React.CSSProperties
    resizable?: boolean
    expandable?: ExpandableConfig
    size?: 'small' | 'middle' | 'large'
    bordered?: boolean
    showHeader?: boolean
    sticky?: StickyConfig
    scroll?: ScrollConfig
    onSortingChange?: (sorting: any[]) => void
    onColumnFiltersChange?: (filters: any[]) => void
    onGlobalFilterChange?: (filter: string) => void
    onRowSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void
    onExpandedChange?: (expandedRowKeys: React.Key[]) => void
    onRefresh?: () => void
    onExport?: () => void
    onCustomAction?: (action: string, data?: any) => void
}

// 表格引用接口
export interface AiiTableProRef<T extends TableData = TableData> {
    // 选择操作
    getSelectedRows: () => T[]
    getSelectedRowKeys: () => string[]
    clearSelection: () => void
    selectAll: () => void

    // 工具操作
    refresh: () => void
    reset: () => void
}

// 上下文类型
export interface AiiTableProContextValue<TData extends TableData = TableData> {
    table: Table<TData>
    props: AiiTableProProps<TData>
}

// 钩子返回类型
export interface UseAiiTableProReturn<TData extends TableData = TableData> {
    table: Table<TData>
    tableRef: React.RefObject<AiiTableProRef<TData>>
    // 状态
    data: TData[]
    loading: boolean
    selectedRows: TData[]
    selectedRowKeys: string[]
    sorting: SortingState
    columnFilters: ColumnFiltersState
    globalFilter: string
    pagination: PaginationState
    columnVisibility: VisibilityState
    expanded: ExpandedState

    // 操作方法
    setData: (data: TData[]) => void
    setLoading: (loading: boolean) => void
    handleRowSelection: (keys: string[]) => void
    handleSorting: (sorting: SortingState) => void
    handleFiltering: (filters: ColumnFiltersState) => void
    handlePagination: (pagination: PaginationState) => void
    handleColumnVisibility: (visibility: VisibilityState) => void
    handleExpanded: (expanded: ExpandedState) => void
}

// 导出所有类型
export type {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    RowSelectionState,
    PaginationState,
    ExpandedState,
    GroupingState,
    ColumnSizingState,
    ColumnOrderState,
    Table,
    Row,
    Cell,
    Header,
    HeaderGroup,
    Column,
    ColumnPinningState,
    OnChangeFn,
    RowData,
    TableOptions,
    Updater,
}

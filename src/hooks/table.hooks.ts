import React, { useState } from 'react'

// 分页数据结构
interface PageData<T> {
    list?: T[]
    total?: number
    pageNum?: number
    pageSize?: number
    pages?: number
}

// 通用结果结构
interface CommonResult<T> {
    code?: number
    message?: string
    data?: T
    success?: boolean
    timestamp?: number
}

// 表格响应结构
interface TableResponse<T> {
    datalist: T[]
    pageNum: number
    pageSize: number
    total: number
}

// 分页参数基础接口
interface PaginationParams {
    current: number
    pageSize: number
}

// API方法类型
type ApiMethod<T, P extends PaginationParams = PaginationParams> = (params: P) => Promise<CommonResult<PageData<T>>>

// 分页参数结构
interface Pagination {
    current: number
    pageSize: number
    total: number
}
interface UseTableTypes<T, P extends PaginationParams = PaginationParams> {
    loading: boolean
    dataSource: T[]
    pagination: Pagination
    queryTableData: (initParams?: Partial<P>, paginationOverride?: Pagination) => Promise<TableResponse<T> | undefined>
    onPageChange: (current: number) => void
    onPageSizeChange: (pageSize: number) => void
    onSearch: (initParams?: Partial<P>) => void
    onSetDataSource: (data: T[]) => void
    selectedRows: T[]
    selectedRowKeys: React.Key[]
    onSelectChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => void
}

function useTable<T, P extends PaginationParams = PaginationParams>(
    apiMethod: ApiMethod<T, P>,
    cb?: (response: PageData<T>) => PageData<T>,
): UseTableTypes<T, P> {
    const [loading, setLoading] = useState(false)
    const [dataSource, setDataSource] = useState<T[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        current: 1,
        pageSize: 10,
        total: 0,
    })
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
    const [selectedRows, setSelectedRows] = useState<T[]>([])
    const [params, setParams] = useState<Record<string, unknown>>({})

    function queryTableData(
        initParams?: Partial<P>,
        paginationOverride?: Pagination,
    ): Promise<TableResponse<T> | undefined> {
        setLoading(true)
        const mergedParams = {
            ...(params || {}),
            ...(initParams || {}),
            current: paginationOverride?.current ?? pagination.current,
            pageSize: paginationOverride?.pageSize ?? pagination.pageSize,
        } as P

        if (initParams) setParams((prev) => ({ ...prev, ...initParams }))

        return apiMethod(mergedParams)
            .then((res: CommonResult<PageData<T>>) => {
                return new Promise<TableResponse<T> | undefined>((resolve) => {
                    setTimeout(() => {
                        setLoading(false)
                        const newRes = res as CommonResult<PageData<T>>
                        if (newRes.success && newRes.data) {
                            const apiData = newRes.data
                            const { list = [], total = 0, pageNum = 1, pageSize = 10, pages } = apiData
                            let processedData: PageData<T> = {
                                list: list as T[],
                                total,
                                pageNum,
                                pageSize,
                                pages: pages ?? Math.ceil(total / pageSize),
                            }
                            if (cb) {
                                processedData = cb(processedData)
                            }
                            setDataSource(processedData.list ?? [])
                            setPagination((prev) => ({
                                ...prev,
                                current: processedData.pageNum ?? pageNum,
                                pageSize: processedData.pageSize ?? pageSize,
                                total: processedData.total ?? total,
                            }))
                        }
                        resolve(newRes as TableResponse<T>)
                    }, 500)
                })
            })
            .catch((error: any) => {
                setLoading(false)
                console.error('Table data query failed:', error)
                return Promise.resolve(undefined)
            })
    }

    function onPageChange(current: number) {
        setPagination((prev) => {
            const newPagination = {
                ...prev,
                current: current,
            }
            queryTableData(undefined, newPagination)
            return newPagination
        })
    }

    function onPageSizeChange(pageSize: number) {
        setPagination((prev) => {
            const newPagination = {
                ...prev,
                pageSize,
            }
            queryTableData(undefined, newPagination)
            return newPagination
        })
    }

    function onSearch(initParams: Partial<P> = {} as Partial<P>) {
        setPagination((prev) => {
            const newPagination = {
                ...prev,
                current: 1,
            }
            queryTableData(initParams, newPagination)
            return newPagination
        })
    }

    function onSetDataSource(data: T[]) {
        setDataSource(data)
    }

    function onSelectChange(newSelectedRowKeys: React.Key[], newSelectedRows: T[]) {
        setSelectedRowKeys(newSelectedRowKeys)
        setSelectedRows(newSelectedRows)
    }

    return {
        loading,
        dataSource,
        pagination,
        queryTableData,
        onPageChange,
        onPageSizeChange,
        onSearch,
        onSetDataSource,
        selectedRows,
        selectedRowKeys,
        onSelectChange,
    }
}

export { useTable, type ApiMethod, type PageData, type CommonResult, type TableResponse }

export default useTable

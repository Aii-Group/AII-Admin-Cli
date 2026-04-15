import { useCallback, useMemo, useState } from 'react'
import type { Key } from 'react'
import { useMutation } from '@tanstack/react-query'

/** 后端分页常见字段 */
interface PageData<T> {
    list?: T[]
    total?: number
    pageNum?: number
    current?: number
    pageSize?: number
    pages?: number
    totalPages?: number
}

interface CommonResult<T> {
    code?: number
    message?: string
    msg?: string
    data?: T
    success?: boolean
    timestamp?: number | string
}

interface TableResponse<T> {
    datalist: T[]
    pageNum: number
    pageSize: number
    total: number
}

interface PaginationParams {
    current: number
    pageSize: number
}

type ApiMethod<T, P extends PaginationParams = PaginationParams> = (params: P) => Promise<CommonResult<PageData<T>>>

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
    selectedRowKeys: Key[]
    onSelectChange: (selectedRowKeys: Key[], selectedRows: T[]) => void
}

type NormalizeFn<T> = (response: PageData<T>) => PageData<T>

function isCommonResultOk<T>(res: CommonResult<T> | undefined): res is CommonResult<T> & { data: T } {
    if (!res || res.data === undefined || res.data === null) {
        return false
    }
    if (res.success === false) {
        return false
    }
    return true
}

function normalizePageData<T>(data: PageData<T>, transform?: NormalizeFn<T>): Required<PageData<T>> {
    const pageSize = Math.max(1, data.pageSize ?? 10)
    const total = data.total ?? 0
    const pageNum = data.pageNum ?? data.current ?? 1
    const pages = data.pages ?? data.totalPages ?? Math.ceil(total / pageSize)

    const normalized: Required<PageData<T>> = {
        list: data.list ?? [],
        total,
        pageNum,
        current: pageNum,
        pageSize,
        pages,
        totalPages: pages,
    }
    const transformed = transform ? transform(normalized) : normalized

    const tPageSize = Math.max(1, transformed.pageSize ?? 10)
    const tTotal = transformed.total ?? 0
    const tPageNum = transformed.pageNum ?? transformed.current ?? 1
    const tPages = transformed.pages ?? transformed.totalPages ?? Math.ceil(tTotal / tPageSize)

    return {
        list: transformed.list ?? [],
        total: tTotal,
        pageNum: tPageNum,
        current: tPageNum,
        pageSize: tPageSize,
        pages: tPages,
        totalPages: tPages,
    }
}

function toTableResponse<T>(data: Required<PageData<T>>): TableResponse<T> {
    return {
        datalist: data.list,
        pageNum: data.pageNum,
        pageSize: data.pageSize,
        total: data.total,
    }
}

const LOADING_MIN_MS = 500

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function useTable<T, P extends PaginationParams = PaginationParams>(
    apiMethod: ApiMethod<T, P>,
    transform?: NormalizeFn<T>,
): UseTableTypes<T, P> {
    const [paginationState, setPaginationState] = useState<Pagination>({ current: 1, pageSize: 10, total: 0 })
    const [searchParams, setSearchParams] = useState<Partial<P>>({} as Partial<P>)
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
    const [selectedRows, setSelectedRows] = useState<T[]>([])
    const [manualDataSource, setManualDataSource] = useState<T[] | null>(null)
    const [pageData, setPageData] = useState<Required<PageData<T>> | null>(null)

    const fetchMutation = useMutation({
        mutationKey: ['useTable', 'fetch'],
        mutationFn: async (params: P) => {
            const startedAt = Date.now()
            const response = await apiMethod(params)
            const elapsed = Date.now() - startedAt
            const remaining = Math.max(0, LOADING_MIN_MS - elapsed)
            if (remaining > 0) {
                await delay(remaining)
            }
            return response
        },
    })

    const pagination = useMemo<Pagination>(
        () => ({
            current: pageData?.pageNum ?? paginationState.current,
            pageSize: pageData?.pageSize ?? paginationState.pageSize,
            total: pageData?.total ?? paginationState.total,
        }),
        [pageData, paginationState],
    )

    const dataSource = manualDataSource ?? pageData?.list ?? []

    const runFetch = useCallback(
        async (params: P): Promise<TableResponse<T> | undefined> => {
            try {
                const response = await fetchMutation.mutateAsync(params)
                if (!isCommonResultOk<PageData<T>>(response)) {
                    return undefined
                }
                const normalized = normalizePageData(response.data, transform)
                setPageData(normalized)
                setPaginationState({
                    current: normalized.pageNum,
                    pageSize: normalized.pageSize,
                    total: normalized.total,
                })
                return toTableResponse(normalized)
            } catch (error) {
                console.error('Table data query failed:', error)
                return undefined
            }
        },
        [fetchMutation, transform],
    )

    const queryTableData = useCallback(
        async (initParams?: Partial<P>, paginationOverride?: Pagination): Promise<TableResponse<T> | undefined> => {
            setManualDataSource(null)
            const nextSearch = initParams ? { ...searchParams, ...initParams } : { ...searchParams }
            if (initParams) {
                setSearchParams(nextSearch)
            }

            const mergedPag: Pagination = {
                current: paginationOverride?.current ?? pagination.current,
                pageSize: paginationOverride?.pageSize ?? pagination.pageSize,
                total: pagination.total,
            }
            if (paginationOverride) {
                setPaginationState((prev) => ({ ...prev, ...mergedPag }))
            }

            const params = {
                ...nextSearch,
                current: mergedPag.current,
                pageSize: mergedPag.pageSize,
            } as P

            return runFetch(params)
        },
        [pagination, runFetch, searchParams],
    )

    const onPageChange = useCallback(
        (current: number) => {
            setManualDataSource(null)
            const params = { ...searchParams, current, pageSize: paginationState.pageSize } as P
            setPaginationState((prev) => ({ ...prev, current }))
            void runFetch(params)
        },
        [paginationState.pageSize, runFetch, searchParams],
    )

    const onPageSizeChange = useCallback(
        (pageSize: number) => {
            setManualDataSource(null)
            const params = { ...searchParams, current: 1, pageSize } as P
            setPaginationState((prev) => ({ ...prev, current: 1, pageSize }))
            void runFetch(params)
        },
        [runFetch, searchParams],
    )

    const onSearch = useCallback(
        (initParams: Partial<P> = {} as Partial<P>) => {
            setManualDataSource(null)
            const nextSearch = { ...searchParams, ...initParams }
            const params = { ...nextSearch, current: 1, pageSize: paginationState.pageSize } as P
            setSearchParams(nextSearch)
            setPaginationState((prev) => ({ ...prev, current: 1 }))
            void runFetch(params)
        },
        [paginationState.pageSize, runFetch, searchParams],
    )

    const onSetDataSource = useCallback((data: T[]) => {
        setManualDataSource(data)
    }, [])

    const onSelectChange = useCallback((nextSelectedRowKeys: Key[], nextSelectedRows: T[]) => {
        setSelectedRowKeys(nextSelectedRowKeys)
        setSelectedRows(nextSelectedRows)
    }, [])

    return {
        loading: fetchMutation.isPending,
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

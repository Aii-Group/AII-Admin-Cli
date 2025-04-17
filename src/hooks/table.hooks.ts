import { useState } from 'react'
import { ResultData } from '@/utils/http/interface'

interface TableResponse<T> {
  list: T[]
  total: number
}

type ApiFunction<T> = (params: Record<string, any>) => Promise<ResultData<TableResponse<T>>>

interface Pagination {
  current: number
  pageSize: number
  total: number
}

interface UseTableResult<T> {
  loading: boolean
  dataSource: T[]
  pagination: Pagination
  queryTableData: () => Promise<ResultData<TableResponse<T>> | undefined>
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSearch: () => void
  onSetDataSource: (data: T[]) => void
  selectedRows: T[]
  selectedRowKeys: React.Key[]
  onSelectChange: (
    selectedRowKeys: React.Key[],
    selectedRows: T[],
    info: { type: 'all' | 'none' | 'invert' | 'single' | 'multiple' },
  ) => void
}

function useTable<T>(
  api: ApiFunction<T>,
  cb?: (response: ResultData<TableResponse<T>>) => ResultData<TableResponse<T>>,
): UseTableResult<T> {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<T[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [selectedRows, setSelectedRows] = useState<T[]>([])

  function queryTableData(
    paginationOverride?: Pagination,
    initParams: Record<string, any> = {},
  ): Promise<ResultData<TableResponse<T>> | undefined> {
    setLoading(true)
    const params = {
      ...initParams,
      pageNum: paginationOverride?.current ?? pagination.current,
      pageSize: paginationOverride?.pageSize ?? pagination.pageSize,
    }

    return api(params)
      .then((res) => {
        setLoading(false)
        if (cb) {
          res = cb(res)
        }
        setDataSource(res.data?.list ?? [])
        setPagination((prev) => ({
          ...prev,
          total: res?.data?.total ?? 0,
        }))
        return res
      })
      .catch(() => {
        setLoading(false)
        return undefined
      })
  }

  function onPageChange(page: number) {
    setPagination((prev) => {
      const newPagination = {
        ...prev,
        current: page,
      }
      queryTableData(newPagination)
      return newPagination
    })
  }

  function onPageSizeChange(pageSize: number) {
    setPagination((prev) => {
      const newPagination = {
        ...prev,
        pageSize,
      }
      queryTableData(newPagination)
      return newPagination
    })
  }

  function onSearch(initParams: Record<string, any> = {}) {
    setPagination((prev) => {
      const newPagination = {
        ...prev,
        current: 1,
      }
      queryTableData(newPagination, initParams)
      return newPagination
    })
  }

  function onSetDataSource(data: T[]) {
    setDataSource(data)
  }

  function onSelectChange(
    newSelectedRowKeys: React.Key[],
    newSelectedRows: T[],
    info: { type: 'all' | 'none' | 'invert' | 'single' | 'multiple' },
  ) {
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

export default useTable

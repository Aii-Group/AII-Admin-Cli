import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import type { TableColumnsType } from 'antd'
import AiiTable from '@/components/AiiTable'
import { getTableData } from '@/api/mock'
import useTable from '@/hooks/table.hooks'
import { DataType } from '@/interface'

export const Route = createFileRoute('/_authentication/table/basic')({
  component: () => <Basic />,
  staticData: {
    code: 'Basic_Table',
    langCode: 'Menu.Basic_Table',
  },
})

const Basic: React.FC = () => {
  const { queryTableData, dataSource, loading, onPageChange, onPageSizeChange, pagination } = useTable(getTableData)

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
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

  useEffect(() => {
    queryTableData()
  }, [])
  return (
    <div className="wrapper">
      <AiiTable
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onPageSizeChange={onPageSizeChange}
        onPageChange={onPageChange}
        operations={['EDIT', 'DELETE']}
      />
    </div>
  )
}

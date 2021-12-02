import { Table } from 'antd'
type TableProps = Parameters<typeof Table>[0]

interface Props<T> extends TableProps {
  dataSource: any[]
  columns: any
  rowKey: any
}

export default function XTable<T>(props: Props<T>) {
  return <Table size="small" bordered {...props} />
}

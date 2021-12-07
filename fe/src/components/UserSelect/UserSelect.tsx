import { fetchUserListApi } from '@/packages/control/apis'
import { Select, Spin } from 'antd'
import { useCallback, useMemo } from 'react'
import { useAsyncFn, useThrottleFn } from 'react-use'
import { debounce } from 'lodash-es'

export default function UserSelect({
  value,
  onChange,
  ...props
}: {
  value: string[]
  onChange(value: string[]): void
}) {
  const [{ value: options = [], loading }, onSearch] = useAsyncFn(async (value: string) => {
    return fetchUserListApi(value).then((res: any) => {
      return res.users.data.map((user: any) => ({ label: user.name, value: user.id }))
    })
  }, [])

  const th = useMemo(() => debounce(onSearch), [])

  const change = (val: any) => {
    onChange(val)
  }
  return (
    <Select
      showSearch
      mode="multiple"
      labelInValue
      filterOption={false}
      onSearch={th}
      notFoundContent={loading ? <Spin size="small" /> : null}
      value={value}
      placeholder="搜索人员"
      onChange={change}
      style={{ width: '100%' }}
      options={options}
      {...((props as any)?.schema?.widgetProps ?? {})}
    />
  )
}

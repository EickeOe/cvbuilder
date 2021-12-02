import useCurrentProduct from '@/hooks/useCurrentProduct'
import useIsProductAdmin from '@/hooks/useIsProductAdmin'
import { envState } from '@/recoil'
import { Select } from 'antd'
import { useEffect, useMemo } from 'react'
import { useRecoilState } from 'recoil'

export default function DevelopSelect() {
  const [env, setEnv] = useRecoilState(envState)

  useEffect(() => {
    localStorage.setItem('GLOBAL_ENV', env)
  }, [env])

  const currentProduct = useCurrentProduct()

  return (
    <Select
      value={env}
      onChange={(value) => {
        setEnv(value)
      }}
      options={[
        {
          label: '本地环境',
          value: 'local'
        },
        ...(currentProduct.envList ?? []).map((item: { label: string; key: string }) => {
          return {
            label: item.label,
            value: item.key
          }
        })
      ]}
    />
  )
}

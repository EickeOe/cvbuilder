import { microAppListState } from '@/recoil'
import { useMemo } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { useRecoilValue } from 'recoil'

export default function useCurrentProduct() {
  const microAppList = useRecoilValue(microAppListState)

  const match = useRouteMatch<{
    product: string
  }>('/:product')

  const currentProductKey = useMemo(() => {
    return match?.params.product ?? ''
  }, [match])

  const currentProductInfo = useMemo(() => {
    let product = microAppList.find((product) => product.key === currentProductKey) || ({} as any)
    // if (!product.key) {
    //   product = microAppList.find((p) => p.key === 'cloud')
    // }
    return product
  }, [microAppList, currentProductKey])
  return currentProductInfo
}

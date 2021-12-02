import { currentManageProductState } from '@/packages/developer/recoil'
import { useSearchParamsValue } from '@gcer/react-air'
import { FC, useEffect } from 'react'
import { fetchAppApi } from '@/packages/developer/apis'
import { useRecoilState } from 'recoil'

const DetailLayout: FC<any> = ({ children }) => {
  const { key } = useSearchParamsValue()
  const [currentManageProduct, setCurrentManageProductState] = useRecoilState(currentManageProductState)
  useEffect(() => {
    if (!currentManageProduct || currentManageProduct.key !== key) {
      fetchAppApi(key).then(setCurrentManageProductState)
    }
  }, [key])
  return <>{children}</>
}
export default DetailLayout

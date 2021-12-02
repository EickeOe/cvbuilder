import { userInfoState } from '@/recoil'
import { isProductAdmin } from '@/utils/auth'
import { useRecoilValue } from 'recoil'

export default function useIsProductAdmin(product: MicroApp) {
  const userInfo = useRecoilValue<any>(userInfoState)
  return isProductAdmin(userInfo, product)
}

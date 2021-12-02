import BasicLayout from '@/components/Layout/Layout'
import { BrowserRouter as Router } from 'react-router-dom'
import { fetchUserInfoApi } from './apis/user'
import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import { microAppListState, userInfoState } from './recoil'
import AppRouter from './router'

import '@/styles/index.less'
import 'antd/dist/antd.less'
import { fetchProductListApi } from './apis/app'
import GlobalData from './components/MicroAppRouter/globalData'

export default function App() {
  const setMicroAppList = useSetRecoilState<MicroApp[]>(microAppListState as any)
  const setUserInfoState = useSetRecoilState(userInfoState)
  useEffect(() => {
    ;(async () => {
      let [userInfo, productList]: any = await Promise.all([fetchUserInfoApi(), fetchProductListApi()])

      console.log(productList)

      setUserInfoState(userInfo)
      // const isGlobalAdmin = userInfo?.roles?.some((role: any) => role.roleCode === 'cloud')
      // const isSomeProductAdmin = userInfo?.roles?.length > 0
      const isGlobalAdmin = true
      const isSomeProductAdmin = true
      if (!isGlobalAdmin) {
        productList = productList.filter((pro: any) => pro.key !== 'control')
      }
      if (!isSomeProductAdmin) {
        productList = productList.filter((pro: any) => pro.key !== 'developer')
      }
      productList = productList.filter((pro: any) => !pro.disabled)
      setMicroAppList(productList)
    })()
  }, [])

  return (
    <Router>
      <GlobalData />
      <BasicLayout>
        <AppRouter />
      </BasicLayout>
    </Router>
  )
}

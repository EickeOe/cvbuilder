import { lazy } from 'react'
// import workOrderRoutes from 'workOrder/routes'
import docsManageRoutes from 'docsManage/routes'
import developerRoutes from 'developer/routes'
import controlRoutes from 'control/routes'
export const ROUTES_MAPPING = {}
const routes: any[] = [
  ...docsManageRoutes,
  ...developerRoutes,
  ...controlRoutes
  // {
  //   path: '/',
  //   component: lazy(() => import('@/pages/Home/Home')),
  //   exact: true
  // }
]

export default routes

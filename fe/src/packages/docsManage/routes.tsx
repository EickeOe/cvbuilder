import { lazy } from 'react'

const routes = [
  {
    path: '/docsManage',
    // layout: Layout,
    children: [
      {
        path: '/docsManage/list',
        component: lazy(() => import('docsManage/pages/List/List')),
        meta: {
          title: '文档管理'
        }
      }
    ]
  }
]
export default routes

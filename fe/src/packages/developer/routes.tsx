import { lazy } from 'react'

const routes = [
  {
    path: '/developer',
    // layout: Layout,
    children: [
      {
        path: '/developer/appManage',
        component: lazy(() => import('developer/pages/ProductManage/pages/List/List')),
        meta: {
          title: '产品管理'
        }
      },
      {
        path: '/developer/app',
        meta: {
          title: '产品详情'
        },
        layout: lazy(() => import('developer/pages/ProductManage/components/DetailLayout/DetailLayout')),
        children: [
          {
            path: '/developer/app/detail',
            component: lazy(() => import('developer/pages/ProductManage/pages/Detail/Detail')),
            meta: {
              title: '产品详情'
            }
          },
          {
            path: '/developer/app/menuManage',
            component: lazy(() => import('developer/pages/ProductManage/pages/MenuManage/MenuManage')),
            meta: {
              title: '菜单管理'
            }
          },
          {
            path: '/developer/app/docManage',
            component: lazy(() => import('developer/pages/ProductManage/pages/DocManage/DocManage')),
            meta: {
              title: '文档管理'
            }
          },
          {
            path: '/developer/app/noticeManage',
            component: lazy(() => import('developer/pages/ProductManage/pages/NoticeManage/NoticeManage')),
            meta: {
              title: '公告管理'
            }
          },
          {
            path: '/developer/app/qaManage',
            component: lazy(() => import('developer/pages/ProductManage/pages/QAManage/QAManage')),
            meta: {
              title: 'QA管理'
            }
          },
          {
            path: '/developer/app/workOrderManage',
            meta: {
              title: '工单管理'
            },
            children: [
              {
                path: '/developer/app/workOrderManage/tsManage',
                component: lazy(() => import('developer/pages/ProductManage/pages/WorkOrderManage/TsManage/TsManage')),
                meta: {
                  title: '值班管理'
                }
              },
              {
                path: '/developer/app/workOrderManage/templateManage',
                component: lazy(
                  () => import('developer/pages/ProductManage/pages/WorkOrderManage/TemplateManage/TemplateManage')
                ),
                meta: {
                  title: '模板管理'
                }
              }
            ]
          },
          {
            path: '/developer/app/authManage',
            component: lazy(() => import('developer/pages/ProductManage/pages/AuthManage/AuthManage')),
            meta: {
              title: '权限管理'
            }
          }
        ]
      }
    ]
  }
]
/**
 * 产品详情
 * 配置产品相关属性
 * 该产品下文档管理
 *
 */
export default routes

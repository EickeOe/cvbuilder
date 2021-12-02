import { lazy } from 'react'

const routes = [
  {
    path: '/control',
    // layout: Layout,
    children: [
      {
        path: '/control/productManage',
        component: lazy(() => import('control/pages/ProductManage/pages/List/List')),
        meta: {
          title: '产品管理'
        }
      },
      {
        path: '/control/product',
        meta: {
          title: '产品详情'
        },
        children: [
          {
            path: '/control/product/detail',
            component: lazy(() => import('control/pages/ProductManage/pages/Detail/Detail')),
            meta: {
              title: '产品详情'
            }
          },
          {
            path: '/control/product/menuManage',
            component: lazy(() => import('control/pages/ProductManage/pages/MenuManage/MenuManage')),
            meta: {
              title: '菜单管理'
            }
          },
          {
            path: '/control/product/docManage',
            component: lazy(() => import('control/pages/ProductManage/pages/DocManage/DocManage')),
            meta: {
              title: '文档管理'
            }
          },
          {
            path: '/control/product/noticeManage',
            component: lazy(() => import('control/pages/ProductManage/pages/NoticeManage/NoticeManage')),
            meta: {
              title: '公告管理'
            }
          },
          {
            path: '/control/product/qaManage',
            component: lazy(() => import('control/pages/ProductManage/pages/QAManage/QAManage')),
            meta: {
              title: 'QA管理'
            }
          },
          {
            path: '/control/product/workOrderManage',
            meta: {
              title: '工单管理'
            },
            children: [
              {
                path: '/control/product/workOrderManage/tsManage',
                component: lazy(() => import('control/pages/ProductManage/pages/WorkOrderManage/TsManage/TsManage')),
                meta: {
                  title: '值班管理'
                }
              },
              {
                path: '/control/product/workOrderManage/templateManage',
                component: lazy(
                  () => import('control/pages/ProductManage/pages/WorkOrderManage/TemplateManage/TemplateManage')
                ),
                meta: {
                  title: '模板管理'
                }
              }
            ]
          },
          {
            path: '/control/product/authManage',
            component: lazy(() => import('control/pages/ProductManage/pages/AuthManage/AuthManage')),
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

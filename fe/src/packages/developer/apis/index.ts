import { gql } from 'graphql-request'
import http, { gqlApi } from './api'

export const fetchProductListApi = (params: { pageNum: number; pageSize: number; appCode?: string }) =>
  http.post('/app/list', params).then((res) => {
    res.data = res.data
      .map((obj: any) => JSON.parse(obj.menuConfig || '{}'))
      .filter((obj: Object) => Object.keys(obj).length > 1)
    return res
  })

export const fetchAppsApi = (query: {
  disabled?: boolean
  pageInfo?: {
    page: number
    size: number
  }
}) =>
  gqlApi
    .request(
      gql`
        query apps($disabled: Boolean, $pageInfo: pageInfo) {
          apps(disabled: $disabled, pageInfo: $pageInfo) {
            data {
              key
              label
              path
              classification
              icon
              devOptions {
                microAppOptions {
                  disableSandbox
                  shadowDOM
                  inline
                }
              }
              menuConfig {
                menus
                enabled
              }
            }
          }
        }
      `,
      query
    )
    .then((res: any) => res.apps)

export const postProductApi = (params: {}) => http.post('/app/create', params)

export const deleteProductApi = (params: { code: string }) =>
  http.post('/app/delete', params, {
    headers: {
      appCode: params.code
    }
  })

export const putAppApi = (app: MicroApp) =>
  gqlApi.request(
    gql`
      mutation updateApp($app: UpdateAppInput!) {
        updateApp(app: $app) {
          key
        }
      }
    `,
    {
      app
    }
  )

export const fetchDocListApi = (params: { pageNum: number; pageSize: number; appCode?: string }) =>
  http.post('/document/list', params, {
    headers: {
      appCode: params.appCode
    }
  })

export const postDocApi = (params: { url: string; appCode: string; id?: number; name?: string }) =>
  http.post('/document/update', params, {
    headers: {
      appCode: params.appCode
    }
  })

export const deleteDocApi = (id: number, appCode: string) =>
  http.post(
    '/document/delete',
    { id },
    {
      headers: {
        appCode
      }
    }
  )
export const deleteFqaApi = (id: number, appCode: string) =>
  http.post(
    '/faq/delete',
    { id },
    {
      headers: {
        appCode
      }
    }
  )

export const fetchQAListApi = (params: { pageNum: number; pageSize: number; appCode?: string; name?: string }) =>
  http.post('/faq/list', params, {
    headers: {
      appCode: params.appCode
    }
  })

export const postQAApi = (params: { content: string; appCode: string; id?: number; name?: string }) =>
  http.post('/faq/update', params, {
    headers: {
      appCode: params.appCode
    }
  })

export const fetchTemplateListApi = (params: { pageNum: number; pageSize: number; appCode?: string; name?: string }) =>
  http.post('/template/list', params, {
    headers: {
      appCode: params.appCode
    }
  })

export const deleteTemplateApi = (params: { id: number; appCode: string }) =>
  http.post('/template/delete', params, {
    headers: {
      appCode: params.appCode
    }
  })

export const postTemplateApi = (params: { content: string; appCode: string; id?: number; name?: string }) =>
  http.post('/template/update', params, {
    headers: {
      appCode: params.appCode
    }
  })

export const postEnableTemplateApi = (params: { id: number; appCode: string }) =>
  http.post('/template/enable', params, {
    headers: {
      appCode: params.appCode
    }
  })

export const fetchUserListApi = (userName: string, appCode: string) =>
  http.post<any, any>(
    '/user/list',
    { userName },
    {
      headers: {
        appCode
      }
    }
  )

export const postRosterApi = (params: {
  appCode: string
  id?: number
  rosterCode?: string
  dutyUsers: {
    userNames: string[]
    level: string
  }[]
}) =>
  http.post('/order/roster/update', params, {
    headers: {
      appCode: params.appCode
    }
  })

export const fetchTsListApi = (params: { appCode: string; name?: string }) =>
  http.post(
    '/order/roster/list',
    {
      ...params,
      pageNum: 1,
      pageSize: 100
    },
    {
      headers: {
        appCode: params.appCode
      }
    }
  )

export const fetchRoleListApi = (appCode: string) =>
  http.get('/role/list', {
    params: {
      appCode
    },
    headers: {
      appCode
    }
  })

export const fetchRoleUserListApi = (roleId: string, appCode: string) =>
  http.get('/role/users', {
    params: {
      roleId
    },
    headers: {
      appCode
    }
  })

export const postRole2UserApi = (params: { roleId: number; username: string }, appCode: string) =>
  http.post('/role/authorize', params, {
    headers: {
      appCode
    }
  })

import { gql } from 'graphql-request'
import http, { gqlApi } from './api'

export const fetchAppApi = (key: string) =>
  gqlApi
    .request(
      gql`
        query app($key: String!) {
          app(key: $key) {
            label
            key
            path
            isBaseApp
            disabled
            devOptions {
              microAppOptions {
                shadowDOM
                disableSandbox
                inline
              }
            }
            menuConfig {
              enabled
              menus
            }
            icon
            classification
          }
        }
      `,
      {
        key
      }
    )
    .then((res) => res.app)

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

export const postAppApi = (app: MicroApp) =>
  gqlApi.request(
    gql`
      mutation createApp($app: NewAppInput!) {
        createApp(app: $app) {
          key
        }
      }
    `,
    {
      app
    }
  )

export const deleteAppApi = (key: string) =>
  gqlApi.request(
    gql`
      mutation deleteApp($key: String!) {
        deleteApp(key: $key) {
          key
        }
      }
    `,
    {
      key
    }
  )

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

export const fetchRoleUserListApi = (params: { key: string; pageInfo?: { page: number; size: number } }) =>
  gqlApi.request(
    gql`
      query app($key: String!, $pageInfo: pageInfo) {
        app(key: $key) {
          owners(pageInfo: $pageInfo) {
            data {
              id
              name
              role
            }
            totalCount
          }
        }
      }
    `,
    params
  )

export const postRole2UserApi = (params: { roleId: number; username: string }, appCode: string) =>
  http.post('/role/authorize', params, {
    headers: {
      appCode
    }
  })

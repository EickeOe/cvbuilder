import { gqlApi } from '@/apis/api'
import { gql } from 'graphql-request'
import http from './api'

export const fetchProductListApi = (params: { pageNum: number; pageSize: number; appCode?: string }) =>
  http.post('/app/list', params).then((res) => {
    res.data = res.data
      .map((obj: any) => JSON.parse(obj.menuConfig || '{}'))
      .filter((obj: Object) => Object.keys(obj).length > 1)
    return res
  })

export const postProductApi = (params: {}) => http.post('/app/create', params)

export const deleteProductApi = (params: { code: string }) => http.post('/app/delete', params)

export const putProductApi = (params: {}) => http.post('/app/update', params)

export const fetchDocListApi = (params: { pageNum: number; pageSize: number; appCode?: string }) =>
  http.post('/document/list', params)

export const postDocApi = (params: { url: string; appCode: string; id?: number; name?: string }) =>
  http.post('/document/update', params)

export const deleteDocApi = (id: number) => http.post('/document/delete', { id })

export const fetchQAListApi = (params: { pageNum: number; pageSize: number; appCode?: string; name?: string }) =>
  http.post('/faq/list', params)

export const postQAApi = (params: { content: string; appCode: string; id?: number; name?: string }) =>
  http.post('/faq/update', params)

export const fetchTemplateListApi = (params: { pageNum: number; pageSize: number; appCode?: string; name?: string }) =>
  http.post('/template/list', params)

export const deleteTemplateApi = (params: { id: number }) => http.post('/template/delete', params)

export const postTemplateApi = (params: { content: string; appCode: string; id?: number; name?: string }) =>
  http.post('/template/update', params)

export const postEnableTemplateApi = (params: { id: number }) => http.post('/template/enable', params)

export const fetchUserListApi = (name: string) =>
  gqlApi.request(
    gql`
      query users($name: String) {
        users(name: $name) {
          data {
            id
            name
          }
        }
      }
    `,
    {
      name
    }
  )

export const postRosterApi = (params: {
  appCode: string
  dutyUsers: {
    userNames: string[]
    level: string
  }[]
}) => http.post('/order/roster/update', params)

export const fetchTsListApi = (params: { appCode: string; name?: string }) =>
  http.post('/order/roster/list', {
    ...params,
    pageNum: 1,
    pageSize: 100
  })

export const fetchRoleListApi = (appCode: string) =>
  http.get('/role/list', {
    params: {
      appCode
    }
  })

export const fetchRoleUserListApi = (roleId: string) =>
  http.get('/role/users', {
    params: {
      roleId
    }
  })

export const postRole2UserApi = (params: { roleId: number; username: string }) => http.post('/role/authorize', params)

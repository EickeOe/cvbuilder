import { gql } from 'graphql-request'
import http, { gqlApi } from './api'

export const fetchDocstApi = () =>
  gqlApi.request(gql`
    query docs {
      docs {
        data {
          id
          name
          parentId
          content
          url
        }
        totalCount
      }
    }
  `)

export const fetchQAListApi = (params: { pageNum: number; pageSize: number; appCode?: string; name?: string }) =>
  http.post('/faq/list', params)

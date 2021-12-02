import { gql } from 'graphql-request'
import http, { gqlApi } from './api'

export const formatProduct = (data: any) => {
  return (
    data
      .map((obj: any) => {
        return JSON.parse(obj.menuConfig || '{}')
      })
      // TODO: 取消格式化
      .filter((obj: Object) => Object.keys(obj).length > 1)
  )
}

export const fetchProductListApi = () =>
  gqlApi
    .request(
      gql`
        query {
          apps {
            data {
              key
              label
              path
              classification
              icon
            }
          }
        }
      `
    )
    .then((res: any) => res.apps.data)

export const fetchRecentVisitApi = () =>
  gqlApi
    .request(
      gql`
        query {
          apps {
            data {
              key
              label
              path
              classification
              icon
            }
          }
        }
      `
    )
    .then((res: any) => res.apps.data)
export const fetchStarredProductListApi = () =>
  gqlApi
    .request(
      gql`
        query {
          apps {
            data {
              key
              label
              path
              classification
              icon
            }
          }
        }
      `
    )
    .then((res: any) => res.apps.data)

export const postStarredApi = (collectViews: { key: string; index?: number }[]) =>
  http.post('/user/collect/update', { collectViews })

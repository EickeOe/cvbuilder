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

export const fetchStarredAppsApi = () =>
  gqlApi
    .request(
      gql`
        {
          user {
            starredApps {
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
    .then((res: any) => res.user.starredApps)

export const postStarredApi = (updateStarredList: { starrableId: string; index?: number }[], type: string) =>
  gqlApi.request(
    gql`
      mutation updateStar($updateStarredList: [UpdateStarInput!]!, $type: String!) {
        updateStar(updateStarredList: $updateStarredList, type: $type) {
          starrable {
            ... on app {
              key
              label
              path
              classification
              icon
            }
          }
        }
      }
    `,
    {
      updateStarredList,
      type
    }
  )

import { gql } from 'graphql-request'
import http, { gqlApi } from './api'

export const fetchUserInfoApi = () =>
  gqlApi.request(gql`
    query user {
      user {
        id
        name
        visitRecords(visitableType: APP, pageInfo: { size: 6, page: 1 }) {
          data {
            visitable {
              ... on app {
                label
                key
                path
                icon
              }
            }
          }
        }
      }
    }
  `)
export const initApi = () =>
  gqlApi.request(gql`
    query {
      user {
        id
        name
        visitRecords(visitableType: APP, pageInfo: { size: 6, page: 1 }) {
          data {
            recordTime
            visitableType
            visitable {
              ... on app {
                label
                key
                path
                icon
              }
            }
          }
        }
      }
      apps(disabled: false) {
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
  `)

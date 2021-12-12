import { gql } from 'graphql-request'
import { gqlApi } from './api'

export const createDocApi = (input: { name: string; parentId: string; url?: string; content?: string }) =>
  gqlApi.request(
    gql`
      mutation createDoc($input: CreateDocInput!) {
        createDoc(input: $input) {
          id
          parentId
          name
          content
          url
          createdAt
          createdUserId
        }
      }
    `,
    {
      input
    }
  )

export const updateDocApi = (input: { id: string; name?: string; parentId?: string; url?: string; content?: string }) =>
  gqlApi.request(
    gql`
      mutation updateDoc($input: UpdateDocInput!) {
        updateDoc(input: $input) {
          id
          parentId
          name
          content
          url
          createdAt
          createdUserId
          updatedAt
          updatedUserId
        }
      }
    `,
    {
      input
    }
  )

export const fetchDocsApi = (params: {
  parentId?: string
  name?: string
  pageInfo?: {
    page: number
    size: number
  }
}) =>
  gqlApi.request(
    gql`
      query docs($parentId: String, $name: String, $pageInfo: pageInfo) {
        docs(parentId: $parentId, name: $name, pageInfo: $pageInfo) {
          data {
            id
            name
            parentId
            content
            updatedAt
            updatedUserId
            url
          }
          totalCount
        }
      }
    `,
    params
  )

export const deleteDocApi = (id: string) =>
  gqlApi.request(
    gql`
      mutation deleteDoc($id: String!) {
        deleteDoc(id: $id) {
          id
        }
      }
    `,
    { id }
  )

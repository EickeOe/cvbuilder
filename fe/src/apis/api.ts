import { ENV } from '@/configs/config'
import axios from 'axios'

import sign from '@/utils/sign'
import { message } from 'antd'

export const DOMAIN_NAME = ENV.VITE_APP_ENV === 'local' ? 'd1' : ENV.VITE_APP_ENV

export function reLogin() {
  const returnUrl = encodeURIComponent(window.location.href)
  window.location.href = `${ENV.VITE_APP_SSO_URL}?returnUrl=${returnUrl}`
}

export const logout = () => {
  location.href = '/'
}

// 全局配置

const fetchHeaderRef = {
  current: { 'Content-Type': 'application/json' }
}

export const setFetchHeader = (header: any) => {
  fetchHeaderRef.current = Object.assign(fetchHeaderRef.current, header)
}

export const getFetchHeader = () => {
  Object.assign(fetchHeaderRef.current, {})
  return fetchHeaderRef.current
}

const requestInterceptors = (config: any) => {
  // 在发送请求之前做些什么
  config.headers = getFetchHeader()

  const method: string = config.method || 'GET'
  const isData = ['post', 'put', 'patch'].includes(method)

  let params = (isData ? config.data : config.params) || {}
  if (['put', 'patch'].includes(method)) {
    params = {}
  }

  let _url = config.url || ''
  _url += _url.includes('?') ? '&' : '?'
  params = JSON.parse(JSON.stringify(params))
  config.url = `${_url}sign=${sign(params)}`
  return config
}

const responseSuccessInterceptors = (response: any) => {
  const { data } = response
  if (!data.status) {
    message.error(data.msg)
    throw data
  }
  return data.data
}

const responseErrInterceptors = (err: any) => {
  if (err && err.response) {
    const resp = err.response
    if ((resp && resp.status === 401) || resp.status === 403) {
      reLogin()
      return
    }
  }
  return Promise.reject(err)
}

axios.interceptors.request.use(requestInterceptors)

// 添加响应拦截器
axios.interceptors.response.use(responseSuccessInterceptors, responseErrInterceptors)

const http = axios.create({
  baseURL: `/api`
})

http.interceptors.request.use(requestInterceptors)
http.interceptors.response.use(responseSuccessInterceptors, responseErrInterceptors)

export default http

import { request, gql, GraphQLClient } from 'graphql-request'

export const gqlApi = new GraphQLClient('/graphql', {
  headers: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMTIzIiwiaWQiOiIxIiwiaWF0IjoxNjM4MjgwMjg0LCJleHAiOjE2NDgyODAyODR9.1ak_rNDecYgVORgBatEUOcnyKBxcb-OXO7RnfNRi_Jo'
  }
})

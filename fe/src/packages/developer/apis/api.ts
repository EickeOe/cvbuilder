import { ENV } from '@/configs/config'
import axios from 'axios'

import sign from '@/utils/sign'
import { message } from 'antd'
import { GraphQLClient } from 'graphql-request'

export const DOMAIN_NAME = ENV.VITE_APP_ENV === 'local' ? 'd1' : ENV.VITE_APP_ENV

export function reLogin() {
  const returnUrl = encodeURIComponent(window.location.href)
  window.location.href = `${ENV.VITE_APP_SSO_URL}?returnUrl=${returnUrl}`
}

// 全局配置

const fetchHeaderRef = {
  current: { 'Content-Type': 'application/json' }
}

export const setFetchHeader = (header: any) => {
  fetchHeaderRef.current = Object.assign(fetchHeaderRef.current, header)
}

export const getFetchHeader = () => {
  Object.assign(fetchHeaderRef.current, {
    backstageCode: 'POIZON_CLOUD'
  })
  return fetchHeaderRef.current
}

const requestInterceptors = (config: any) => {
  // 在发送请求之前做些什么
  config.headers = { ...getFetchHeader(), ...config.headers }

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
  const { data: result } = response

  if (!result.status) {
    message.error(result.message)
    throw result
  }
  return result.data
}

const responseErrInterceptors = (err: any) => {
  if (ENV.VITE_APP_ENV === 'local') {
    return err
  }
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
  baseURL: `${ENV.VITE_DOMAIN_URL}api/v1/h5/poizon-cloud-admin/apis`
})

http.interceptors.request.use(requestInterceptors)
http.interceptors.response.use<any>(responseSuccessInterceptors, responseErrInterceptors)

export default http

export const gqlApi = new GraphQLClient('/graphql', {
  headers: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMTIzIiwiaWQiOiIxIiwiaWF0IjoxNjM4MjgwMjg0LCJleHAiOjE2NDgyODAyODR9.1ak_rNDecYgVORgBatEUOcnyKBxcb-OXO7RnfNRi_Jo'
  }
})

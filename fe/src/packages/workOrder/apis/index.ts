import http from './api'

export const postWorkOrderApi = (params: { appCode: string; content: string; name: string }) =>
  http.post('/order/create', params)

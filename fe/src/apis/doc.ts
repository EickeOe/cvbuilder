import http from './api'

export const fetchDocListApi = (params: { pageNum: number; pageSize: number; appCode?: string }) =>
  http.post('/document/list', params)

export const fetchQAListApi = (params: { pageNum: number; pageSize: number; appCode?: string; name?: string }) =>
  http.post('/faq/list', params)

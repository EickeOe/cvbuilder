import http from './api'

export const fetchTemplate4ProductApi = (appCode: string) => http.post(`/template/enabled/list`, { appCode })

export const uploadImgApi = (fd: FormData) => http.post('/order/upload', fd)

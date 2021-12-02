import http from './api'

const formatProduct = (data: any) => {
  let cbData: any = ''
  data.data ? (cbData = data.data) : (cbData = data)
  return (
    cbData
      .map((obj: any) => {
        return JSON.parse(obj.menuConfig || '{}')
      })
      // TODO: 取消格式化
      .filter((obj: Object) => Object.keys(obj).length > 1)
  )
}

// 快捷导航
export const fastMenus = () => http.get<Promise<any[]>>('/user/fast/list').then(formatProduct)

// 最近访问
export const recentVisitApi = () => http.get<Promise<any[]>>('/user/recent/list').then(formatProduct)

// 更新最近访问接口
export const updateRecent = (params: { recentView: String }) => http.post<Promise<any[]>>('/user/recent/update', params)

//添加快速访问
export const addFastListApi = (fastViews: { fastViews: Array<string> }) =>
  http.post<Promise<any[]>>('/user/fast/update', { fastViews })

// 搜索产品
export const queryApp = (params: { appCode?: string; name?: string; pageNum: number; pageSize: number }) =>
  http.post('/app/list', params).then(formatProduct)

//  查询文档
export const queryDocList = (params: { appCode?: string; name?: string; pageNum: number; pageSize: number }) =>
  http.post('/document/list', params)

//  查询公告
export const queryBulletn = (params: {
  appCode?: string
  name?: string
  pageNum: number
  pageSize: number
  status: number
}) => http.post('/bulletin/list', params)

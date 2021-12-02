import { PageInfoModel } from 'src/model/page-info.model'

export function pageInfo2typeorm(pageInfo: PageInfoModel) {
  const take = pageInfo?.size
  const skip = ((pageInfo?.page || 1) - 1) * pageInfo?.size
  return {
    take,
    skip
  }
}

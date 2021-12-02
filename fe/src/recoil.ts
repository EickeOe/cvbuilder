import { atom } from 'recoil'
import menusJson from '@/routes.json'
import { ENV } from './configs/config'

export const userInfoState = atom<{
  id: number
}>({
  key: 'userInfoState',
  default: {} as any
})

export const breadcrumbSelectPathListState = atom({
  key: 'breadcrumbSelectPathListState',
  default: []
})

export const menusState = atom({
  key: 'menusState',
  default: menusJson
})
export const microAppListState = atom<MicroApp[]>({
  key: 'microAppListState',
  default: []
})

export const envState = atom({
  key: 'envState',
  default: localStorage.getItem('GLOBAL_ENV') ?? ENV.VITE_APP_ENV
})

export const apiEnvState = atom({
  key: 'apiEnvState',
  default: localStorage.getItem('GLOBAL_API_ENV') ?? 'prod'
})

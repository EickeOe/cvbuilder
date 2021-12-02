import { atom } from 'recoil'

export const currentManageProductState = atom<MicroApp>({
  key: 'currentManageProductState',
  default: null as any
})

import { microAppListState } from '@/recoil'
import { useMemo } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { useRecoilValue } from 'recoil'

export default function useCurrentApp(): MicroApp {
  const microAppList = useRecoilValue(microAppListState)

  const match = useRouteMatch<{
    app: string
  }>('/:app')

  const currentAppKey = useMemo(() => {
    return match?.params.app ?? ''
  }, [match])

  const currentAppInfo = useMemo(() => {
    let app = microAppList.find((app) => app.key === currentAppKey) || ({} as any)
    // if (!app.key) {
    //   app = microAppList.find((p) => p.key === 'cloud')
    // }
    return app
  }, [microAppList, currentAppKey])
  return currentAppInfo
}

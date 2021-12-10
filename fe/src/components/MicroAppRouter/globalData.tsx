import useCurrentApp from '@/hooks/useCurrentApp'
import useUpdateAppVisitRecord from '@/hooks/useUpdateAppVisitRecord'
import { apiEnvState, envState } from '@/recoil'
import { baseAppObservable, baseAppSubject } from '@/rx'
import getDomain4Env from '@/utils/getDomain4Env'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

export default function GlobalData() {
  const env = useRecoilValue(envState)
  const currentProduct = useCurrentApp()
  useUpdateAppVisitRecord()
  const apiEnv = useRecoilValue(apiEnvState)
  useEffect(() => {
    // ;(window as any).microApp = new EventCenterForMicroApp('kirn')
    ;(window as any).baseApp = baseAppObservable
  }, [])

  useEffect(() => {
    localStorage.setItem('GLOBAL_ENV', env)
  }, [env])
  useEffect(() => {
    localStorage.setItem('GLOBAL_API_ENV', apiEnv)
    const domain = getDomain4Env(apiEnv)
    localStorage.setItem('GLOBAL_API_PREFIX', `${domain}/cloudApi`)
    const API_PREFIX = localStorage.getItem('GLOBAL_API_PREFIX')
    baseAppSubject.next({ apiEnv, apiPrefix: API_PREFIX })
  }, [apiEnv])
  return <></>
}

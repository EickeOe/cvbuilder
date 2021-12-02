import '@micro-zoe/micro-app/polyfill/jsx-custom-event'

import appList from '@/microAppList.json'
import { useEffect, useMemo, useRef } from 'react'
import { Route } from 'react-router-dom'
import microApp from '@micro-zoe/micro-app'
import { useRecoilValue } from 'recoil'
import { apiEnvState, envState, microAppListState } from '@/recoil'
import { BehaviorSubject, scan, shareReplay, Subject } from 'rxjs'
import { ENV } from '@/configs/config'
import { baseAppObservable, baseAppSubject } from '@/rx'
import GlobalData from './globalData'
import getDomain4Env from '@/utils/getDomain4Env'
// import { EventCenterForMicroApp } from '@micro-zoe/micro-app/interact'

export default function MicroAppRouter() {
  const env = useRecoilValue(envState)

  const envRef = useRef(env)
  useEffect(() => {
    envRef.current = env
  }, [env])
  const microAppList = useRecoilValue(microAppListState)

  const domain = useMemo(() => {
    return getDomain4Env(env)
  }, [env])
  useEffect(() => {
    if (microAppList.length > 0) {
      const modules = microAppList
        .map((app) => {
          const { devOptions } = app
          const arr = []

          if (devOptions.microAppOptions?.inline) {
            const key = app.key
            arr.push({
              loader(code: string, url: string) {
                if (envRef.current === 'local') {
                  code = code.replace(RegExp(`(from|import)(\\s*['"])(\/${key}\/)`, 'g'), (all) => {
                    return all.replace(`/${key}/`, `${app.devOptions.main}${key}/`)
                  })
                  if (/(import\()(\s*['"])(\.\.?\/)/g.test(code)) {
                    code = code.replace(/(import\()(\s*['"])(\.\.?\/)/g, (all, $1, $2, $3) => {
                      return all.replace($3, `${app.devOptions.main}${key}/`)
                    })
                  }

                  if (/\@vite\/client$/.test(url)) {
                    code = code.replace(
                      `const socket = new WebSocket(\`\${socketProtocol}://\${socketHost}\`, 'vite-hmr');`,
                      `const socket = new WebSocket(\`${app.devOptions.main.replace(/^http/, 'ws')}${
                        app.key
                      }/\`, 'vite-hmr');`
                    )
                    // code = ''
                  }
                }
                return code
              }
            })
          } else {
            arr.push({
              loader(code: string, url: string) {
                if (env === 'local' && code.indexOf('sockjs-node') > -1) {
                  code = code.replace('window.location.port', devOptions.port)
                }
                return code
              }
            })
          }
          return {
            [app.key]: arr
          }
        })
        .reduce((p: any, c: any) => ({ ...p, ...c }), {})
      microApp.start({
        plugins: {
          modules: modules as any
        },
        lifeCycles: {
          created(e: any) {
            baseAppSubject.next({
              lifecycle: 'created',
              microApp: {
                key: e.detail.name
              }
            })
          },
          beforemount(e: any) {
            baseAppSubject.next({
              lifecycle: 'beforemount',
              microApp: {
                key: e.detail.name
              }
            })
          },
          mounted(e: any) {
            baseAppSubject.next({
              lifecycle: 'mounted',
              microApp: {
                key: e.detail.name
              }
            })
          },
          unmount(e: any) {
            baseAppSubject.next({
              lifecycle: 'unmount',
              microApp: {
                key: e.detail.name
              }
            })
          },
          error(e: any) {
            baseAppSubject.next({
              lifecycle: 'error',
              microApp: {
                key: e.detail.name
              }
            })
          }
        }
      })
    }
  }, [microAppList])
  return (
    <>
      {microAppList
        .filter((app) => !app.isBaseSubProduct)
        .map((app) => {
          const devOptions = app.devOptions
          let main = `${domain}/cloudFront/${app.key}/${env}`

          // TODO: 等等统一本地开发环境
          if (env === 'local') {
            main = app.devOptions.main
          }

          return (
            <Route key={`router-route-${app.key}`} path={`/${app.key}`}>
              <micro-app
                name={app.key}
                // library={`cloud-${app.key}`}
                baseroute={`/${app.key}`}
                // TODO: 支持多环境
                url={main}
                // data={{ from: '来自基座的数据' }}
                onMounted={() => {
                  console.log(app)
                }}
                // destory
                {...(devOptions.microAppOptions ?? {})}
              />
            </Route>
          )
        })}
    </>
  )
}

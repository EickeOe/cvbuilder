import routes from '@/routes'
import { Result } from 'antd'
import { FC, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useAsync } from 'react-use'
import DocumentTitle from './components/DocumentTitle/DocumentTitle'
import MicroAppRouter from './components/MicroAppRouter/MicroAppRouter'
// import { useSpring, animated, useTransition } from 'react-spring'

export default function AppRouter() {
  const metaMap = useRef<{ [key: string]: any }>({})
  const routesRef = useRef(
    (() => {
      let rs: any = []
      const flatMap = (routes: any[], arr: any[] = [], layout?: any) => {
        return routes.map((route) => {
          metaMap.current[route.path] = route.meta ?? {}
          const { meta, children } = route
          if (route.children?.length) {
            flatMap(route.children, arr, route.layout)
          } else {
            // TODO: 待优化，采用递归，而不是平铺
            if (layout) {
              const Layout = layout
              const Com = route.component
              rs.push(
                <Route exact={route.exact} key={`router-route-${route.path}`} path={route.path}>
                  <Layout>
                    <Com />
                  </Layout>
                </Route>
              )
            } else {
              arr.push(
                <Route
                  exact={route.exact}
                  key={`router-route-${route.path}`}
                  path={route.path}
                  component={route.component}
                />
              )
            }
          }
        })
      }
      routes.map((route) => {
        if (route.children) {
          const { layout: Layout = (p: any) => p.children }: any = route

          const arr: any[] = []
          flatMap(route.children ?? [], arr)
          rs.push(
            <Route key={`router-route-${route.path}`} path={route.path}>
              <Layout>{arr}</Layout>
            </Route>
          )
        } else {
          rs.push(
            <Route
              exact={route.exact}
              key={`router-route-${route.path}`}
              path={route.path}
              component={route.component}
            />
          )
        }
      })
      return rs
    })()
  )

  // const location = useLocation()
  // const transitions = useTransition(location, {
  //   from: { opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  //   // reverse: flip,
  //   delay: 200
  // })
  return (
    <>
      <DocumentTitle metaMap={metaMap.current} />
      <Suspense fallback={''}>
        {/* {transitions((props, item) => {
          console.log(item)
          return (
            <animated.div style={props}> */}
        <Switch>
          <Route exact path="/control">
            <Redirect to="/control/productManage" />
          </Route>

          {routesRef.current}

          <MicroAppRouter />
          <Route path="*" exact>
            <Result status="404" subTitle="你访问的页面可能不存在或没有权限哦，如需申请权限请联系基础架构" />
          </Route>
        </Switch>
        {/* </animated.div>
          )
        })} */}
      </Suspense>
    </>
  )
}

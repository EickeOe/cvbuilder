import { Drawer, DrawerProps } from 'antd'
import { FC } from 'react'

export default function XDrawer(props: Parameters<FC<DrawerProps>>[0]) {
  return (
    <Drawer
      contentWrapperStyle={{
        height: 'calc(100vh - 48px)',
        top: 48
      }}
      bodyStyle={{ padding: 0 }}
      style={{ zIndex: 960 }}
      {...props}
    />
  )
}

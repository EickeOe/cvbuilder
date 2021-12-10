import { Space, Dropdown, Menu, Avatar } from 'antd'
import { LogoutOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { useRecoilState, useRecoilValue } from 'recoil'
import { envState, userInfoState } from '@/recoil'
// import { ENV } from '@/configs/config'
import { Link } from 'react-router-dom'
import className from './index.module.less'
import MenuBtn from '../MenuBtn/MenuBtn'
import { useBoolean } from '@/hooks/useBoolean'
import MenusDrawer from '../MenusDrawer/MenusDrawer'
import HelpDocsModal from '../HelpDocsModal/HelpDocsModal'
import WorkOrderDrawer from '../WorkOrderDrawer/WorkOrderDrawer'
import Extra from './Extra'
import { logout } from '@/apis/api'
import { useEffect, useMemo } from 'react'
import useIsProductAdmin from '@/hooks/useIsProductAdmin'
import useCurrentApp from '@/hooks/useCurrentApp'
import DevelopSelect from './DevelopSelect'

interface Props {}

export default function BasicHeader({}: Props) {
  const userInfo = useRecoilValue<any>(userInfoState)
  const currentProduct = useCurrentApp()
  const isCurrentProductAdmin = useIsProductAdmin(currentProduct)
  const [env, setEnv] = useRecoilState(envState)

  const [isOpen, setIsOpen] = useBoolean(false)
  const [vis, setVis] = useBoolean()
  const [workOrderVis, setWorkOrderVis] = useBoolean()
  const hasEnv = useMemo(() => {
    return !!currentProduct.envList
  }, [currentProduct])

  useEffect(() => {
    if (Object.keys(currentProduct).length > 0) {
      if (!isCurrentProductAdmin || !hasEnv) {
        setEnv('prod')
      }
    }
  }, [currentProduct, isCurrentProductAdmin])
  const theme = env === 'prod' || Object.keys(currentProduct).length === 0 ? className.light : className.dark

  return (
    <>
      <header className={`${className.layoutHeader} ${theme}`}>
        <div className={className.basicHeader}>
          <Space size={16} style={{ marginLeft: -16 }}>
            <div className="flex">
              <MenuBtn onClick={setIsOpen.toggle} isOpen={isOpen} />
            </div>
            <Space size={16}>
              <Avatar shape="square" size={24} icon={<img src="/favicon.ico" />} />
              <span>CV Builder</span>
              <Extra />
            </Space>
            {/* <NavMenu selectedKeys={selectedKeys} menuProps={{ mode: 'horizontal' }} menus={navMenus} /> */}
          </Space>
          <Space className={className.spaceRight}>
            {isCurrentProductAdmin && (
              <>
                <span className={className.item}>
                  {hasEnv ? (
                    <DevelopSelect />
                  ) : currentProduct.isBaseApp ? (
                    ''
                  ) : (
                    <Link to={`/developer/product/detail?key=${currentProduct.key}`}>配置环境</Link>
                  )}
                </span>
                <Link to="/developer/productManage">
                  <span className={className.item}>开发者中心</span>
                </Link>
              </>
            )}

            {/* <span className={className.item} onClick={setWorkOrderVis.on}>
              onCall
            </span> */}

            <span className={className.item}>
              <QuestionCircleOutlined onClick={setVis.on} />
            </span>

            {/* <Extra /> */}
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="logout"
                    onClick={() => {
                      logout()
                    }}
                  >
                    <LogoutOutlined />
                    退出登录
                  </Menu.Item>
                </Menu>
              }
            >
              <div className="user">
                <Avatar
                  style={{ marginRight: 8 }}
                  size={24}
                  icon={<img src="https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png" />}
                />
                <span>{userInfo?.realName}</span>
              </div>
            </Dropdown>
          </Space>
        </div>
      </header>
      <HelpDocsModal visible={vis} close={setVis.off} />
      <WorkOrderDrawer visible={workOrderVis} close={setWorkOrderVis.off} />
      <MenusDrawer visible={isOpen} close={setIsOpen.off} />
    </>
  )
}

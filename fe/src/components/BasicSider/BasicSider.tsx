import { Layout, Menu, Avatar } from 'antd'
import { useMemo, useRef, useState } from 'react'
import styles from './index.module.less'
import { MenuUnfoldOutlined, MenuFoldOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router'
const { Sider } = Layout
import NavMenu from '../NavMenu/NavMenu'
import Icon from '../Icon/Icon'
import useCurrentProduct from '@/hooks/useCurrentProduct'
interface Props {
  product: MicroApp
  back: {
    show: boolean
    path: string
  }
  siderMenus: any[]
}

export default function BasicSider(props: Props) {
  const themeRef = useRef<'light'>('light')
  const history = useHistory()
  const { siderMenus, back, product } = props

  const [siderSwitch, setSiderSwitch] = useState(true)
  const siderWidth = useMemo(() => (siderSwitch ? 208 : 48), [siderSwitch])
  const currentProduct = useCurrentProduct()

  return (
    <>
      <div
        className={styles.layoutSiderPlaceholder}
        style={{
          width: siderWidth,
          overflow: 'hidden',
          flex: '0 0 208px',
          maxWidth: siderWidth,
          minWidth: siderWidth
        }}
      ></div>

      <Sider
        collapsedWidth={48}
        width={siderWidth}
        collapsed={!siderSwitch}
        className={`${styles.layoutSider} ${styles.light}`}
        style={{
          overflow: 'hidden'
        }}
      >
        <div className={styles.logoWrap}>
          <div className="logo" style={{ margin: '0 auto', display: 'flex', alignItems: 'center' }}>
            <Icon type={currentProduct.icon ?? 'AppstoreOutlined'} />
            {siderSwitch && <span style={{ lineHeight: '1', marginLeft: 8 }}>{product.label}</span>}
          </div>
        </div>

        {back?.show && (
          <div className={styles.siderBack}>
            <Menu
              theme={themeRef.current}
              inlineIndent={16}
              className={`sider-back-menu`}
              selectedKeys={[]}
              openKeys={[]}
              mode="inline"
            >
              <Menu.Item
                className={styles.siderBackButton}
                title={false}
                key="back"
                onClick={() => {
                  history.push(back?.path)
                }}
                icon={<ArrowLeftOutlined />}
              >
                返回
              </Menu.Item>
            </Menu>
          </div>
        )}

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {siderMenus.length > 0 && (
            <NavMenu
              titleClickDisabled
              menuProps={{ mode: 'inline', collapsedWidth: 48, theme: themeRef.current }}
              defaultOpen
              menus={siderMenus}
            />
          )}
        </div>
        <div className={styles.siderLinks}>
          <Menu
            theme={themeRef.current}
            inlineIndent={16}
            className={styles.siderLinkMenu}
            selectedKeys={[]}
            openKeys={[]}
            mode="inline"
          >
            <Menu.Item
              className={styles.siderCollapsedButton}
              title={false}
              key="collapsed"
              onClick={() => {
                setSiderSwitch((p) => !p)
              }}
            >
              {siderSwitch ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            </Menu.Item>
          </Menu>
        </div>
      </Sider>
    </>
  )
}

import { Row, Col, Popover, Badge, Button, Menu, Dropdown, Empty, message } from 'antd'
import { ExclamationCircleOutlined, PlusCircleOutlined, CloseCircleFilled } from '@ant-design/icons'

import className from '../index.module.less'

import { Link } from 'react-router-dom'
import { addFastListApi } from '@/apis/landing'

interface props {
  quickMenus: Array<any>
  recentList: Array<any>
  allProducts: Array<any>
  changeQuickMenus(): void
}

export default function LandingMyNav({ quickMenus, changeQuickMenus, recentList, allProducts }: props) {
  // 循环最近访问导航
  const isNewView = (item: any, index: number, quick = false) => {
    return item.isNew ? (
      <div className={className.landingViewBadgeItem}>
        {quick ? (
          <CloseCircleFilled
            onClick={(e) => {
              e.stopPropagation()
              deleteMenuHandle(item, index)
            }}
            style={{ fontSize: 18 + 'px', color: 'rgb(126 124 124)' }}
            className={className.quickClosed}
          />
        ) : (
          ''
        )}
        <Link to={item.path}>
          <Badge.Ribbon text={'new'} className={className.ladningBadag}>
            <div className={`${className.landingViewItem} rounded`}>{item.label}</div>
          </Badge.Ribbon>
        </Link>
      </div>
    ) : (
      <div className={`${className.landingViewItem} rounded`}>
        {quick ? (
          <CloseCircleFilled
            onClick={(e) => {
              e.stopPropagation()
              deleteMenuHandle(item, index)
            }}
            style={{ fontSize: 18 + 'px', color: 'rgb(126 124 124)' }}
            className={className.quickClosed}
          />
        ) : (
          ''
        )}
        <Link to={item.path}>{item.label}</Link>
      </div>
    )
  }

  // 下拉菜单
  const dropMenu = () => (
    <div className={`${className.dropdownView} rounded-sm shadow`}>
      <Menu>
        {allProducts &&
          allProducts.length &&
          allProducts.map((item,index) => {
            return (
              <Menu.Item className={className.landingDropMenu} onClick={choiseMenuHandle} key={item.path}>
                {item.label}
              </Menu.Item>
            )
          })}
      </Menu>
    </div>
  )

  // 下拉选择添加快捷入口
  const choiseMenuHandle = async (key: any) => {
    
    let _quickMenus: any = []
    if (quickMenus && quickMenus.length) {
      quickMenus.forEach((item) => {
        _quickMenus.push(item.key)
      })
    }
    let _key = key.key
    let _old = allProducts.find((item) => item.path === _key)
    if (_quickMenus.indexOf(_old.key) > -1) {
      message.info('此菜单已存在快捷入口中')
      return false
    }
    _quickMenus.push(_old.key)
    await addFastListApi(_quickMenus)

    changeQuickMenus()
  }

  // 删除快捷入口
  const deleteMenuHandle = async (item: any, index: number) => {
    let _quickMenus: any = []
    let copyQuickMenus: any = [...quickMenus]
    copyQuickMenus.splice(index, 1)

    if (copyQuickMenus && copyQuickMenus.length) {
      copyQuickMenus.forEach((item: any) => {
        _quickMenus.push(item.key)
      })
    }
    await addFastListApi(_quickMenus)
    changeQuickMenus()
  }

  return (
    <div className={`${className.landingmyNav} shadow`}>
      <div className="text-lg extrabold">我的导航</div>
      <div className="text-sm mt-4 mb-4 text-gray-400">
        最近访问
        <Popover content={'展示您最近的访问的菜单'} trigger="hover">
          <span className={className.iconLately}>
            <ExclamationCircleOutlined />
          </span>
        </Popover>
      </div>
      <Row className={className.landingViewNav} gutter={[10, 10]}>
        {recentList && recentList.length ? (
          recentList.map((item, index) => {
            return (
              <Col key={item.id || index} span={4}>
                {isNewView(item, index)}
              </Col>
            )
          })
        ) : (
          <Empty description={'暂无导航'} />
        )}
      </Row>

      <div className="text-sm mt-8 mb-4 text-gray-400">
        <Row gutter={[10, 10]} align="middle">
          <Col span={2}>快捷入口</Col>
          <Col span={4}>
            <Dropdown overlay={dropMenu} trigger={['click']}>
              <Button
                onClick={(e) => e.preventDefault()}
                icon={<PlusCircleOutlined className={className.iconStyle} />}
                block
              >
                添加快捷入口
              </Button>
            </Dropdown>
          </Col>
        </Row>
      </div>
      <Row className={className.landingViewNav} gutter={[10, 10]}>
        {quickMenus && quickMenus.length > 0 ? (
          quickMenus.map((item: any, index) => {
            return (
              <Col key={item.id || index} span={4}>
                {isNewView(item, index, true)}
              </Col>
            )
          })
        ) : (
          <Empty description={'快去添加快捷入口'} />
        )}
      </Row>
    </div>
  )
}

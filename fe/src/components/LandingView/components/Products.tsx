import { Row, Col, Popover, Input, Tabs, Empty } from 'antd'

import { microAppListState } from '@/recoil'
import { memo, useEffect, useMemo, useState, useRef } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import PinyinMatch from 'pinyin-match'

import { filteredProductCountState } from '../../MenusDrawer/recoil'

const { Search } = Input
const { TabPane } = Tabs

import className from '../index.module.less'

import { ExclamationCircleOutlined, ProjectFilled, InteractionFilled } from '@ant-design/icons'

import { Link } from 'react-router-dom'
import { values } from 'lodash'

interface props {
  filter?(product: MicroApp): boolean
  keyword: string
  searchHandle(key: string): void
}

export default memo(function LandingProducts() {
  // 搜索全部产品和服务
  const productList: any = useRecoilValue(microAppListState)

  // 搜索
  const [selectProduct, setSelectProduct] = useState([])

  const onSearch = (keyword: string) => {
    searchAction(keyword)
  }
  const searchAction = (keyword: string = '') => {
    if (!productList || productList.length === 0) return
    if (!keyword) {
      setSelectProduct(productList)
      return
    }
    let result: any = []
    productList.forEach((item: any) => {
      let m = PinyinMatch.match(item.label, keyword)
      if (m) {
        result.push(item)
      }
      setSelectProduct(result)
    })
  }

  useEffect(() => {
    searchAction()
  }, [productList.length])

  return (
    <div className={`${className.allProduct} shadow`}>
      <div className="text-lg extrabold">全部产品与服务</div>

      <div className="text-sm mt-4 text-gray-400">
        搜索产品与服务
        <Popover content={'请搜索您要找的产品'} trigger="hover">
          <span className={className.iconLately}>
            <ExclamationCircleOutlined />
          </span>
        </Popover>
      </div>
      <div className="mb-4 mt-2">
        <Search
          placeholder="搜索产品或服务的名称或关键字"
          onChange={(e) => {
            onSearch(e.target.value)
          }}
          style={{ width: 100 + '%' }}
        />
      </div>
      <div className="text-sm mt-4 mb-4 text-gray-400">产品与服务列表</div>
      <div className="all-product-view">
        <Row gutter={[20, 20]}>
          {selectProduct && selectProduct.length ? (
            selectProduct.map((item: any, index) => {
              return (
                <Col span={6} key={item.path || index}>
                  <Link to={item.path}>
                    <Row className={className['product-item']} gutter={[10, 20]} align="middle">
                      <Col>
                        <div className={className['product-img']}>
                          {index % 2 == 0 ? (
                            <ProjectFilled
                              style={{ fontSize: 35 + 'px', color: '#22a7f0' }}
                              className={`${className['img-icon']} ${className['product-view-icon']}`}
                            />
                          ) : (
                            <InteractionFilled
                              style={{ fontSize: 35 + 'px', color: '#22a7f0' }}
                              className={`${className['img-icon']} ${className['product-view-icon']}`}
                            />
                          )}
                        </div>
                      </Col>
                      <Col className={className['text']}>
                        <h3>{item.label}</h3>
                      </Col>
                    </Row>
                  </Link>
                </Col>
              )
            })
          ) : (
            <Empty description={'暂无产品和服务'} />
          )}
        </Row>
      </div>
    </div>
  )
})

import { Row, Col } from 'antd'

import className from './index.module.less'
import LandingMyNav from './components/MyNav'
import LandingProduct from './components/Products'
import LandingHelpDoc from './components/HelpDoc'
import LandingSwiper from './components/Swiper'
import LandingNotic from './components/Notice'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { fastMenus, recentVisitApi, queryApp, queryDocList, queryBulletn } from '@/apis/landing'
import { microAppListState } from '@/recoil'
import { useRecoilValue } from 'recoil'

import PinyinMatch from 'pinyin-match'
import { fetchRecentVisitApi } from '@/apis/app'

interface quickMenusFace {
  id: string
  name: string
  url: string
  isNew: boolean
  used: boolean
  subTitle: string
}

export default function Landing() {
  const [quickMenus, setQuickMenus] = useState([])
  const [recentList, setRecentList] = useState([])
  const [docList, setDocList] = useState([])
  const [bulletinList, setBulletinList] = useState([])

  // 快捷入口
  const fetchFastData = async () => {
    const result: any = await fastMenus()
    setQuickMenus(result)
  }
  useEffect(() => {
    fetchFastData()
  }, [])

  // 最近访问
  const fetchRecentData = async () => {
    const result: any = await fetchRecentVisitApi()
    setRecentList(result)
  }
  useEffect(() => {
    fetchRecentData()
  }, [])

  // 查询文档
  const fetchDocData = async () => {
    const result: any = await queryDocList({
      name: '',
      pageNum: 1,
      pageSize: 9999
    })
    setDocList(result.data)
  }
  useEffect(() => {
    fetchDocData()
  }, [])

  //  查询公告
  const fetchBulletinData = async () => {
    const result: any = await queryBulletn({
      name: '',
      pageNum: 1,
      status: 2,
      appCode: '',
      pageSize: 9999
    })
    setBulletinList(result.data)
  }
  useEffect(() => {
    fetchBulletinData()
  }, [])

  const allProducts = useRecoilValue(microAppListState)

  return (
    <div className={className.landingView}>
      <Row gutter={[20, 20]}>
        <Col span={17}>
          <LandingMyNav
            quickMenus={quickMenus}
            recentList={recentList}
            allProducts={allProducts}
            changeQuickMenus={() => {
              fetchFastData()
            }}
          />
          <LandingProduct />
          <LandingHelpDoc docList={docList} />
        </Col>
        <Col span={7}>
          <LandingSwiper />
          <LandingNotic bulletinList={bulletinList} />
        </Col>
      </Row>
    </div>
  )
}

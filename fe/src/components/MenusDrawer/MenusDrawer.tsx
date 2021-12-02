import { fetchRecentVisitApi, fetchStarredProductListApi, formatProduct, postStarredApi } from '@/apis/app'
import { microAppListState } from '@/recoil'
import { AppstoreOutlined, CloseOutlined, DragOutlined, SearchOutlined } from '@ant-design/icons'
import { createFuncModal, usePersistFn } from '@gcer/react-air'
import { Typography, Drawer, Input } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAsync } from 'react-use'
import { useRecoilValue } from 'recoil'
import AppItem from './components/AppItem/AppItem'
import className from './index.module.less'
import { recentVisitApi, updateRecent } from '@/apis/landing'
import useCurrentProduct from '@/hooks/useCurrentProduct'
import PinyinMatch from 'pinyin-match'
import ProductWrap from './components/ProductWrap/ProductWrap'
import { filteredProductCountState } from './recoil'
import Icon from '../Icon/Icon'
import LiftList from './components/LiftList/LiftList'
const { Paragraph, Text } = Typography

interface Props {
  visible: boolean
  close: (e: any) => void
}

export default function MenusDrawer({ visible, close }: Props) {
  const currentProduct = useCurrentProduct()

  const { value: recentList = [] }: any = useAsync(() => fetchRecentVisitApi(), [currentProduct])
  // TODO: useAsync 支持set
  // const { value: starredProductList = [] } = useAsync<() => Promise<any[]>>(fetchStarredProductListApi as any, [])

  const [starredProductList, setStarredProductList] = useState<MicroApp[]>([])
  useEffect(() => {
    fetchStarredProductListApi()
      .then((res) => res.sort((a: any, b: any) => a.index - b.index))
      .then(setStarredProductList as any)
  }, [])

  const onChangeStarredProductList = useCallback(async (nextList) => {
    setStarredProductList(nextList)
    await postStarredApi(nextList)
  }, [])

  const onClickStar = usePersistFn(async (product: MicroApp, e: Event) => {
    e.stopPropagation()
    e.preventDefault()
    const cP = starredProductList.find((sp) => sp.key === product.key)
    let nextList = []
    if (cP) {
      nextList = starredProductList.filter((sp) => sp.key !== product.key)
    } else {
      nextList = [...starredProductList, product]
    }

    nextList = nextList.sort((pp, np) => pp.index - np.index).map((p, index) => ({ ...p, index }))
    onChangeStarredProductList(nextList)
  })

  const [keyword, setKeyword] = useState('')

  const filterFn = useMemo(() => {
    if (keyword) {
      return (product: MicroApp) => {
        return !!PinyinMatch.match(product.label, keyword)
      }
    }
  }, [keyword])

  const filteredProductCount = useRecoilValue(filteredProductCountState)

  return (
    <Drawer
      width={960}
      contentWrapperStyle={{
        height: 'calc(100vh - 48px)',
        top: 48
      }}
      bodyStyle={{ padding: 0 }}
      style={{ zIndex: 960, transform: 'translateZ(0)' }}
      closable={false}
      placement="left"
      visible={visible}
      onClose={close}
    >
      <div className={`${className.menusDrawer}`}>
        <LiftList
          onUnStarred={onClickStar}
          starredProductList={starredProductList}
          onChangeStarredProductList={onChangeStarredProductList}
          close={close}
        />
        <div className={className.right}>
          <div className={className.toolbar}>
            <div className={className.search}>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                prefix={<SearchOutlined />}
                placeholder="请输入关键词"
              />
            </div>
          </div>
          <div className="lastAccessWrap">
            <div className={className.title}>最近访问</div>
            <div className={`${className.col} ${className.lastAccess}`}>
              {recentList.map((item: MicroApp, index: number) => {
                return (
                  <AppItem
                    starred={!!starredProductList.find((sp) => sp.key === item.key)}
                    onClickStar={onClickStar.bind(null, item)}
                    onClick={close}
                    key={`${index}`}
                    app={item}
                  />
                )
              })}
            </div>
          </div>
          <br />
          <div className="allAppWrap">
            {!!keyword ? (
              <Paragraph className={className.result}>
                共找到 <Text className="hl primary">{filteredProductCount}</Text> 个与
                <Text code className="hl primary">
                  {keyword}
                </Text>
                相关的产品。
              </Paragraph>
            ) : (
              <div className={className.title}>全部产品</div>
            )}

            <div className={`${className.col}`}>
              <ProductWrap
                filter={filterFn}
                onItemClick={close as any}
                onClickStar={onClickStar}
                starredProductList={starredProductList}
              />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export const menusDrawer = createFuncModal(MenusDrawer)

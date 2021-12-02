import { fetchRecentVisitApi, fetchStarredAppsApi, postStarredApi } from '@/apis/app'
import { SearchOutlined } from '@ant-design/icons'
import { createFuncModal, usePersistFn } from '@gcer/react-air'
import { Typography, Drawer, Input } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAsync } from 'react-use'
import { useRecoilValue } from 'recoil'
import AppItem from './components/AppItem/AppItem'
import className from './index.module.less'
import useCurrentApp from '@/hooks/useCurrentApp'
import PinyinMatch from 'pinyin-match'
import AppWrap from './components/AppWrap/AppWrap'
import { filteredAppCountState } from './recoil'
import LiftList from './components/LiftList/LiftList'
const { Paragraph, Text } = Typography

interface Props {
  visible: boolean
  close: (e: any) => void
}

export default function MenusDrawer({ visible, close }: Props) {
  const currentApp = useCurrentApp()

  const { value: recentList = [] }: any = useAsync(() => fetchRecentVisitApi(), [currentApp])
  // TODO: useAsync 支持set

  const [starredApps, setStarredApps] = useState<MicroApp[]>([])
  useEffect(() => {
    fetchStarredAppsApi().then(setStarredApps as any)
  }, [])

  const onChangeStarredApps = useCallback(async (nextList) => {
    setStarredApps(nextList)
    await postStarredApi(
      nextList.map((item: MicroApp) => ({ index: item.index, starrableId: item.key })),
      'app'
    )
  }, [])

  const onClickStar = usePersistFn(async (app: MicroApp, e: Event) => {
    e.stopPropagation()
    e.preventDefault()
    const cP = starredApps.find((sp) => sp.key === app.key)
    let nextList = []
    if (cP) {
      nextList = starredApps.filter((sp) => sp.key !== app.key)
    } else {
      nextList = [...starredApps, app]
    }

    nextList = nextList.sort((pp, np) => pp.index - np.index).map((p, index) => ({ ...p, index }))
    onChangeStarredApps(nextList)
  })

  const [keyword, setKeyword] = useState('')

  const filterFn = useMemo(() => {
    if (keyword) {
      return (app: MicroApp) => {
        return !!PinyinMatch.match(app.label, keyword)
      }
    }
  }, [keyword])

  const filteredAppCount = useRecoilValue(filteredAppCountState)

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
          starredApps={starredApps}
          onChangeStarredApps={onChangeStarredApps}
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
                    starred={!!starredApps.find((sp) => sp.key === item.key)}
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
                共找到 <Text className="hl primary">{filteredAppCount}</Text> 个与
                <Text code className="hl primary">
                  {keyword}
                </Text>
                相关的产品。
              </Paragraph>
            ) : (
              <div className={className.title}>全部产品</div>
            )}

            <div className={`${className.col}`}>
              <AppWrap
                filter={filterFn}
                onItemClick={close as any}
                onClickStar={onClickStar}
                starredApps={starredApps}
              />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export const menusDrawer = createFuncModal(MenusDrawer)

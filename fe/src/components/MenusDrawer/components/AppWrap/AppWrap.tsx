import { microAppListState } from '@/recoil'
import { memo, useEffect, useMemo, useRef } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import AppItem from '../AppItem/AppItem'
import styles from './index.module.less'
import menusDrawerStyles from '../../index.module.less'
import { filteredAppCountState } from '../../recoil'
interface Props {
  filter?(product: MicroApp): boolean
  starredApps: MicroApp[]
  onItemClick(): void
  onClickStar(product: MicroApp, e: any): void
}

export default memo(function AppWrap({ filter = () => true, starredApps, onClickStar, onItemClick }: Props) {
  const productList = useRecoilValue(microAppListState)
  const setFilteredAppCount = useSetRecoilState(filteredAppCountState)

  const countRef = useRef(0)
  const filteredAppMap = useMemo(() => {
    countRef.current = 0
    const map = new Map<string, MicroApp[]>()
    productList.forEach((product) => {
      if (filter(product)) {
        if (!map.has(product.classification)) {
          map.set(product.classification, [])
        }
        map.get(product.classification)?.push(product)
        countRef.current++
      }
    })
    return map
  }, [productList, filter])

  useEffect(() => {
    setFilteredAppCount(countRef.current)
  }, [filteredAppMap])

  return (
    <>
      {[...filteredAppMap].map(([key, productLs], index) => {
        return (
          <div key={`pw-${key}-${index}`} className={styles.classification}>
            <span className={`${menusDrawerStyles.title} ${styles.title}`}>{key}</span>
            {productLs.map((item, idx) => {
              return (
                <AppItem
                  starred={!!starredApps.find((sp) => sp.key === item.key)}
                  onClickStar={onClickStar.bind(null, item)}
                  onClick={onItemClick}
                  key={`${item.key}-${idx}`}
                  app={item}
                />
              )
            })}
          </div>
        )
      })}
    </>
  )
})

import { StarFilled, StarOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import styles from './index.module.less'
import { updateRecent } from '@/apis/landing'
import Icon from '@/components/Icon/Icon'

interface Props {
  onClick?(e: any): void
  onClickStar?(..._: any[]): void
  app: MicroApp
  starred?: boolean
}

export default function AppItem({ app, onClick, onClickStar, starred }: Props) {
  // 点击抽屉菜单，请求最近访问接口
  const clickHandle = (e: any) => {
    updateRecent({ recentView: app.key })
    onClick && onClick(e)
  }
  return (
    <Link to={app.path} onClick={clickHandle} className={styles.appItem}>
      <span className={styles.label}>
        <Icon type={app.icon ?? 'AppstoreOutlined'} />
        {app.label}
      </span>
      <span onClick={onClickStar} className={`${styles.star} ${starred ? styles.starred : ''}`}>
        {starred ? <StarFilled /> : <StarOutlined />}
      </span>
    </Link>
  )
}

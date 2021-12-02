import useCurrentProduct from '@/hooks/useCurrentProduct'
import { apiEnvState } from '@/recoil'
import getDomain4Env from '@/utils/getDomain4Env'
import isPrEnv from '@/utils/isPrEnv'
import { CloudServerOutlined, DownOutlined, HomeOutlined } from '@ant-design/icons'
import { Dropdown, Menu, Space } from 'antd'
import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import styles from './index.module.less'

export default function Extra() {
  const [apiEnv, setApiEnv] = useRecoilState(apiEnvState)
  const currentProduct = useCurrentProduct()
  const [hasEnv, envList, envLabelMap] = useMemo(() => {
    const has = !!currentProduct.envList
    const map = new Map()
    let arr: { key: string; label: string }[] = []
    if (has) {
      const kReg = /^pr/

      if (isPrEnv()) {
        arr = currentProduct.envList.filter((env: any) => kReg.test(env.key))
      } else {
        arr = currentProduct.envList.filter((env: any) => !kReg.test(env.key))
      }

      for (const env of arr) {
        map.set(env.key, env.label)
      }
    }

    return [has, arr, map]
  }, [currentProduct])

  useEffect(() => {
    if (envLabelMap.size > 0 && !envLabelMap.has(apiEnv)) {
      if (isPrEnv()) {
        setApiEnv('prod')
      } else {
        setApiEnv(envList[0]?.key)
      }
    }
  }, [envLabelMap, apiEnv, envList])

  return (
    <Space className="flex">
      <Link to={'/'}>
        <div className={styles.extraBtn}>
          <HomeOutlined />
          &nbsp;工作台
        </div>
      </Link>
      {hasEnv && (
        <Dropdown
          overlay={
            <Menu
              onClick={(e) => {
                setApiEnv(e.key as any)

                const domain = getDomain4Env(apiEnv)
                localStorage.setItem('GLOBAL_API_ENV', apiEnv)
                localStorage.setItem('GLOBAL_API_PREFIX', `${domain}/cloudApi`)
                // TODO: 暂时直接刷新
                location.reload()
              }}
              selectedKeys={[apiEnv]}
            >
              {envList.map((env: any) => {
                if (env.children && env.children.length > 0) {
                  return (
                    <Menu.ItemGroup title={env.label} key={env.key}>
                      {env.children.map((e: any) => {
                        return <Menu.Item key={e.key}>{e.label}</Menu.Item>
                      })}
                    </Menu.ItemGroup>
                  )
                }
                return <Menu.Item key={env.key}>{env.label}</Menu.Item>
              })}
            </Menu>
          }
        >
          <div className={styles.extraBtn}>
            <CloudServerOutlined />
            &nbsp;{envLabelMap.get(apiEnv)}&nbsp;
            <DownOutlined />
          </div>
        </Dropdown>
      )}

      <div id="extraWrap"></div>
    </Space>
  )
}

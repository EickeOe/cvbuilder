import { fetchDocsApi, fetchQAListApi } from '@/apis/doc'
import useCurrentApp from '@/hooks/useCurrentApp'
import { microAppListState } from '@/recoil'
import { DownOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons'
import { Collapse, List } from 'antd'
import { useMemo } from 'react'
import { useAsync } from 'react-use'
import { useRecoilValue } from 'recoil'
import styles from './index.module.less'

export default function HelpDocs() {
  const { value: docs = [] } = useAsync(
    (): Promise<any[]> =>
      Promise.all([
        fetchDocsApi().then((res: any) => {
          const map = res.docs.data.reduce((pre: any, current: any) => {
            if (!pre[current.parentId]) {
              pre[current.parentId] = []
            }
            pre[current.parentId].push(current)
            return pre
          }, {})

          return map
        })
      ]),
    []
  )
  const microAppList = useRecoilValue(microAppListState)

  const list = useMemo(() => {
    if (docs.length) {
      return microAppList.map((product) => ({
        ...product,
        docs: (docs[0] as any)[product.key] || []
      }))
    }
    return []
  }, [docs, microAppList])

  const currentProduct = useCurrentApp()
  return (
    <div className={styles.helpDocs}>
      <div>
        <div className={styles.title}>产品文档</div>
        <Collapse bordered={false} defaultActiveKey={[currentProduct.key]}>
          {(currentProduct.key ? list.filter((app) => app.key === currentProduct.key) : list).map((app) => (
            <Collapse.Panel header={app.label} key={app.key}>
              <List
                size="small"
                dataSource={app.docs}
                renderItem={(item: any) => (
                  <List.Item>
                    <a
                      style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      href={item.url}
                      target="_blank"
                    >
                      <FileTextOutlined /> &nbsp;&nbsp;{item.name}
                    </a>
                  </List.Item>
                )}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
        {!currentProduct.key && (
          <div className={styles.more}>
            <span>更多</span>
            <DownOutlined style={{ fontSize: 12 }} />
          </div>
        )}
      </div>

      {/* <div>
        <div className={styles.title}>常见问题 Q&A</div>
        <Collapse bordered={false}>
          {(currentProduct.key ? list.filter((app) => app.key === currentProduct.key) : list).map((app) => (
            <Collapse.Panel header={app.label} key={app.key}>
              <Collapse bordered={false}>
                {app.qaList?.map(({ name, content }: any, index: number) => (
                  <Collapse.Panel header={name} key={`${index}`}>
                    <div>{content}</div>
                  </Collapse.Panel>
                ))}
              </Collapse>
            </Collapse.Panel>
          ))}
        </Collapse>
        {!currentProduct.key && (
          <div className={styles.more}>
            <span>更多</span>
            <DownOutlined style={{ fontSize: 12 }} />
          </div>
        )}
        <div className={styles.quickQ}>
          <span>我要提问</span>
          <EditOutlined />
        </div>
      </div> */}
    </div>
  )
}

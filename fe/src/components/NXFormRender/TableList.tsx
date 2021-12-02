import { Button } from 'antd'
import { Render } from './XFormRender'
import styles from './tableList.module.less'

export default function TableList({ displayList, getFieldsProps, hideTitle, addItem, copyItem, deleteItem }: any) {
  return (
    <div className={styles.tableList}>
      <div className={styles.list}>
        {displayList.map((item: any, idx: number) => {
          const fieldsProps: any = getFieldsProps(idx)
          fieldsProps.displayType = 'inline'
          if (hideTitle) {
            fieldsProps.hideTitle = true
          }
          return (
            <div key={idx} className={styles.item}>
              <Render {...fieldsProps}></Render>
              <span style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 24 }}>
                <Button
                  onClick={() => {
                    deleteItem(idx)
                  }}
                >
                  删除
                </Button>
              </span>
            </div>
          )
        })}
      </div>

      <Button onClick={addItem} style={{ width: '100%' }}>
        添加
      </Button>
    </div>
  )
}

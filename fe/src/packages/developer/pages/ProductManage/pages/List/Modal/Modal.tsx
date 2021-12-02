import XFormRender from '@/components/NXFormRender/XFormRender'
import XDrawer from '@/components/XDrawer/Drawer'
import { postAppApi, putAppApi } from '@/packages/developer/apis'
import { createFuncModal } from '@gcer/react-air'
import { Button, notification } from 'antd'
import { useEffect, useMemo, useRef } from 'react'
import { useAsyncFn } from 'react-use'
import json from './form.json'
import styles from './index.module.less'

interface Props {
  data?: {
    product?: any
  }
  visible: boolean
  onOk?(): void
  close(): void
}

export default function Modal({ visible, data, close, onOk }: Props) {
  const formRef = useRef<any>()

  const isNew = useMemo(() => {
    return !data?.product
  }, [data])

  const formJson = useMemo(() => {
    // if (isNew) {
    //   ;(json.properties[3] as any).widgetProps = {
    //     disabled: false
    //   }
    // } else {
    //   ;(json.properties[3] as any).widgetProps = {
    //     disabled: true
    //   }
    // }

    return json
  }, [isNew])

  useEffect(() => {
    if (visible && data?.product) {
      const product = data.product
      formRef.current.setFieldsValue(product)
    }
  }, [visible, data])

  const [{ loading }, ok] = useAsyncFn(async () => {
    const values = await formRef.current.validate()
    if (isNew) {
      await postAppApi(values)
    } else {
      await putAppApi(values)
    }
    onOk?.()
    close()
    notification.success({
      message: `${isNew ? '新增' : '编辑'}产品成功！`
    })
  }, [isNew])
  return (
    <XDrawer
      width={800}
      footer={
        <div
          style={{
            textAlign: 'right'
          }}
        >
          <Button onClick={close} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button loading={loading} onClick={ok} type="primary">
            提交
          </Button>
        </div>
      }
      title={`${isNew ? '新增' : '编辑'}产品`}
      placement="right"
      onClose={close}
      visible={visible}
    >
      <div className={styles.formWrap}>
        <XFormRender ref={formRef} options={formJson as any} />
      </div>
    </XDrawer>
  )
}
export const modal = createFuncModal(Modal)

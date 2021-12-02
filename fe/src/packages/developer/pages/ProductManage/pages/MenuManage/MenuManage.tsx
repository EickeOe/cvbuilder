import CodeEditor from '@/components/CodeEditor/CodeEditor'
import XFormRender from '@/components/NXFormRender/XFormRender'
import { fetchAppApi, putAppApi } from '@/packages/developer/apis'
import { currentManageProductState } from '@/packages/developer/recoil'
import { getSearchParams } from '@gcer/react-air'
import { Button, Card, notification, PageHeader } from 'antd'
import { useEffect, useRef } from 'react'
import { useAsync, useAsyncFn } from 'react-use'
import { useRecoilValue } from 'recoil'
import formJson from './form.json'
import styles from './index.module.less'

export default function MenuManage() {
  const formRef = useRef<any>()
  const currentManageProduct = useRecoilValue(currentManageProductState)
  const { value: detail } = useAsync(async () => {
    const { key } = getSearchParams(location.search)
    return fetchAppApi(key)
  }, [])

  useEffect(() => {
    if (detail) {
      detail.menus = JSON.stringify(detail.menus, null, '  ')
      formRef.current.setFieldsValue({
        ...(detail.menuConfig ?? {}),
        menus: JSON.stringify(detail.menuConfig?.menus ?? {}, null, '  ')
      })
    }
  }, [detail])

  const [{ loading }, submit] = useAsyncFn(async () => {
    const values = await formRef.current.validate()

    const menuConfig = {
      ...values,
      menus: JSON.parse(values.menus)
    }
    delete detail.menus

    await putAppApi({ ...detail, menuConfig })
    notification.success({
      message: `保存成功！`
    })
  }, [detail])
  return (
    <>
      <PageHeader
        ghost={false}
        title={`${currentManageProduct?.label}-菜单管理`}
        extra={
          <>
            <Button loading={loading} type="primary" onClick={submit}>
              保存
            </Button>
          </>
        }
      />
      <Card bordered={false}>
        <div className={styles.formWrap}>
          <XFormRender ref={formRef} options={formJson as any} widgets={{ CodeEditor }} />
        </div>
      </Card>
    </>
  )
}

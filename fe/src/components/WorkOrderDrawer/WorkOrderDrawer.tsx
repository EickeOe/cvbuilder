import { Card, Drawer, Button, message } from 'antd'
import { fetchTemplate4ProductApi } from '@/apis/workOrder'
import XFormRender from '@/components/NXFormRender/XFormRender'
import useCurrentApp from '@/hooks/useCurrentApp'
import { postWorkOrderApi } from '@/packages/workOrder/apis'
import { microAppListState } from '@/recoil'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAsyncFn } from 'react-use'
import { useRecoilValue } from 'recoil'
import RichTextEditor from '../RichTextEditor/RichTextEditor'
// import options from './form.json'
import styles from './index.module.less'

interface Props {
  visible: boolean
  close: () => void
}

export default function WorkOrderDrawer({ visible, close }: Props) {
  const microAppList = useRecoilValue(microAppListState)
  const formRef = useRef<any>()

  // const {value}= useAsync(()=>fetchTemplateListApi(),[])
  let currentProduct = useCurrentApp()

  if (!currentProduct.key) {
    currentProduct = {
      key: 'cloud'
    }
  }

  const options = useMemo(() => {
    const productList = [
      {
        value: 'cloud',
        label: 'CV Builder'
      },
      ...microAppList.map((app) => ({
        label: app.label,
        value: app.key,
        path: app.path
      }))
    ]

    return {
      type: 'object',
      column: 1,
      labelLayout: {
        type: 'horizontal',
        width: '150px'
      },
      properties: [
        {
          key: 'name',
          label: '标题',
          widget: 'input',
          widgetProps: {
            maxLength: 50,
            placeholder: '标题输入限制50个字符'
          },
          rules: [
            {
              required: true
            }
          ]
        },
        {
          key: 'appCode',
          label: '云产品',
          widget: 'select',
          // value: productList.filter((opt) => opt.path === currentProduct.key)?.[0]?.value ?? 'POIZON_CLOUD',
          widgetProps: {
            style: {
              width: '100%'
            },
            showSearch: true
          },
          options: productList,
          rules: [
            {
              required: true
            }
          ]
        },
        {
          key: 'level',
          label: '优先级',
          widget: 'radiogroup',
          initialValue: '3',
          value: '3',
          options: [
            {
              label: 'P0',
              value: '0'
            },
            {
              label: 'P1',
              value: '1'
            },
            {
              label: 'P2',
              value: '2'
            },
            {
              label: 'P3',
              value: '3'
            }
          ],
          rules: [
            {
              required: true
            }
          ]
        },
        {
          key: 'content',
          label: '描述问题',
          widget: 'RichTextEditor',
          value: '',
          rules: [
            {
              required: true
            }
          ]
        }
      ]
    }
  }, [microAppList])

  useEffect(() => {
    if (visible) {
      fetchTemplate4ProductApi(currentProduct.key).then((data: any) => {
        formRef.current?.setFieldValue({
          appCode: currentProduct.key,
          content: data.content
        })
      })
    }
  }, [visible, currentProduct])

  const [{ loading }, submit] = useAsyncFn(async () => {
    const values = await formRef.current.validate()
    const data: any = await postWorkOrderApi(values)
    message.success('提交成功，准备跳转到飞书~', 1)
    const iframe = document.createElement('iframe')
    iframe.src = `https://applink.feishu.cn/client/chat/open?openChatId=${data.chat_id}`
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    close()
    iframe.onload = () => {
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 10000)
    }
  }, [])

  return (
    <Drawer
      contentWrapperStyle={{
        height: 'calc(100vh - 48px)',
        top: 48
      }}
      title="onCall"
      bodyStyle={{ padding: 0 }}
      style={{ zIndex: 960 }}
      width={800}
      visible={visible}
      onClose={close}
      footer={
        <div
          style={{
            textAlign: 'right'
          }}
        >
          <Button onClick={close} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button loading={loading} onClick={submit} type="primary">
            提交
          </Button>
        </div>
      }
    >
      <Card bordered={false} className={styles.createWrap}>
        <div className="formWrap">
          <XFormRender
            onChange={(formData, prefFormData) => {
              if (formData.appCode !== prefFormData.appCode) {
                fetchTemplate4ProductApi(formData.appCode).then((data: any) => {
                  formRef.current.setFieldValue({
                    content: data.content
                  })
                })
              }
            }}
            widgets={{ RichTextEditor }}
            ref={formRef}
            options={options as any}
          />
        </div>
      </Card>
    </Drawer>
  )
}

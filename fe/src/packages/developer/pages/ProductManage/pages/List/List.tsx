import { Button, Card, PageHeader, Popconfirm, Space, Switch } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import './index.less'
import XTableRender from '@/components/XTableRender/XTableRender'
import { modal } from './Modal/Modal'
import { useAsyncFn } from 'react-use'
import { usePersistFn, useSearchParams } from '@gcer/react-air'
import { deleteAppApi, fetchAppsApi, putAppApi } from 'developer/apis'
import { Link } from 'react-router-dom'
import Icon from '@/components/Icon/Icon'

function Action({ onEdit, onDel, data }: { data: any; onEdit(): void; onDel(): void }) {
  const [{ loading }, del] = useAsyncFn(async () => {
    await deleteAppApi(data.key)
    onDel()
  }, [])
  return (
    <>
      <Link to={`/developer/app/detail?key=${data.key}`}>
        <Button type="link">详情</Button>
      </Link>
      <Popconfirm title="确认删除?" onConfirm={del} okText="确定" cancelText="取消">
        <Button loading={loading} type="link">
          删除
        </Button>
      </Popconfirm>
    </>
  )
}

function DisSwitch({ app, onChange }: { app: MicroApp; onChange(value: boolean): void }) {
  const [{ loading }, submit] = useAsyncFn(
    async (disabled) => {
      await putAppApi({ ...app, disabled })
      console.log({ ...app, disabled })
      onChange(disabled)
    },
    [app]
  )
  return <Switch loading={loading} checked={app.disabled} onChange={submit} />
}

export default function List() {
  const xTableRef = useRef<any>({
    reset() {},
    onQuery(..._: any) {},
    refresh() {},
    setList(..._: any) {},
    getCurrentList: () => []
  })

  const api = useCallback(async (p) => {
    return fetchAppsApi({
      pageInfo: { page: p.current, size: p.pageSize }
    }).then((res: any) => {
      return {
        list: res.data,
        total: res.totalCount
      }
    })
  }, [])

  const onEdit = usePersistFn((app) => {
    modal({
      data: {
        app
      },
      onOk() {
        xTableRef.current.refresh()
      }
    } as any)
  })

  const columnsRef = useRef([
    {
      title: '产品名称',
      dataIndex: 'label',
      key: 'label'
    },
    {
      title: 'key',
      key: 'key',
      dataIndex: 'key'
    },
    {
      title: '图标',
      key: 'icon',
      dataIndex: 'icon',
      width: 50,
      align: 'center',
      render(iconStr: string) {
        return <Icon type={iconStr} />
      }
    },
    {
      title: '禁用',
      key: 'disabled',
      width: 80,
      align: 'center',
      render(app: MicroApp) {
        return (
          <DisSwitch
            app={app}
            onChange={(disabled) => {
              xTableRef.current.setList((prevList: any[]) => {
                const next = prevList.map((ru) => {
                  if (ru.key === app.key) {
                    ru.disabled = disabled
                  }
                  return ru
                })
                return next
              })
            }}
          />
        )
      }
    },
    {
      title: '产品分类',
      key: 'classification',
      dataIndex: 'classification'
    },
    {
      title: '首页地址',
      key: 'path',
      dataIndex: 'path'
    },

    {
      title: '操作',
      width: 140,
      key: 'action',
      render(app: any) {
        return (
          <Action
            data={app}
            onDel={() => {
              const list = xTableRef.current.getCurrentList()
              if (list.length <= 1) {
                xTableRef.current.refresh((p: any) => {
                  const next = { ...p }
                  next.current = next.current - 1
                  return next
                })
              } else {
                xTableRef.current.refresh()
              }
            }}
            onEdit={onEdit.bind(null, app)}
          />
        )
      }
    }
  ])

  const onNewBtnClick = useCallback(() => {
    modal({
      data: {
        isNew: true
      },
      onOk() {
        xTableRef.current.refresh()
      }
    } as any)
  }, [])

  return (
    <>
      <PageHeader ghost={false} title="产品管理" />
      <Card bordered={false}>
        <XTableRender
          api={api}
          ref={xTableRef}
          extra={
            <>
              <Button type="primary" icon={<PlusOutlined />} onClick={onNewBtnClick}>
                新增
              </Button>
            </>
          }
          xFormRender={{
            form: {
              type: 'object',
              layout: 'inline',
              properties: {
                appCode: {
                  label: '产品名称',
                  widget: 'input',
                  placeholder: '请选择产品',
                  widgetProps: {
                    style: {
                      width: '150px'
                    }
                  },
                  options: []
                },
                key: {
                  label: 'key',
                  widget: 'input',
                  placeholder: '请输入key'
                },
                classification: {
                  label: '分类',
                  widget: 'select',
                  widgetProps: {
                    style: {
                      width: '150px'
                    }
                  },
                  placeholder: '请选择分类',
                  options: []
                }
              }
            }
          }}
          columns={columnsRef.current as any}
          rowKey={(row: any) => `${row.key}`}
        />
      </Card>
    </>
  )
}

import { Button, Card, PageHeader, Popconfirm, Space, Switch } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import XTableRender from '@/components/XTableRender/XTableRender'
import { modal } from './Modal/Modal'
import { useAsyncFn } from 'react-use'
import { getSearchParams, usePersistFn } from '@gcer/react-air'
import { deleteTemplateApi, fetchTemplateListApi, postEnableTemplateApi } from 'developer/apis'
import 'braft-editor/dist/output.css'
import { useRecoilValue } from 'recoil'
import { currentManageProductState } from '@/packages/developer/recoil'

function StatusSwitch({ template, onChange }: { template: any; onChange(): void }) {
  const [{ loading }, change] = useAsyncFn(
    usePersistFn(async () => {
      const { key } = getSearchParams()
      await postEnableTemplateApi({ ...template, appCode: key })
      onChange()
    }),
    []
  )
  return <Switch loading={loading} checked={template.status === 1} onChange={change} />
}

function Action({ onEdit, onDel, data }: { data: any; onEdit(): void; onDel(): void }) {
  const [{ loading }, del] = useAsyncFn(async () => {
    const { key } = getSearchParams()
    await deleteTemplateApi({
      id: data.id,
      appCode: key
    })
    onDel()
  }, [])
  return (
    <>
      <Button type="link" onClick={onEdit}>
        编辑
      </Button>
      <Popconfirm title="确认删除?" onConfirm={del} okText="确定" cancelText="取消">
        <Button loading={loading} type="link">
          删除
        </Button>
      </Popconfirm>
    </>
  )
}

export default function TemplateManage() {
  const currentManageProduct = useRecoilValue(currentManageProductState)
  const xTableRef = useRef<any>({
    reset() {},
    onQuery(..._: any) {},
    refresh() {},
    setList(..._: any) {},
    getCurrentList: () => []
  })

  const api = useCallback(async (p) => {
    const { key } = getSearchParams(location.search)
    return fetchTemplateListApi({
      ...p,
      pageNum: p.current,
      pageSize: p.pageSize,
      appCode: key
    }).then((res: any) => {
      return {
        list: res.data,
        total: res.total
      }
    })
  }, [])

  const onEdit = usePersistFn((template) => {
    modal({
      data: {
        template
      },
      onOk() {
        xTableRef.current.refresh()
      }
    } as any)
  })

  const columnsRef = useRef([
    {
      title: '状态',
      key: 'status',
      align: 'center',
      width: 60,
      render(template: any) {
        return (
          <StatusSwitch
            template={template}
            onChange={() => {
              xTableRef.current.refresh()
            }}
          />
        )
      }
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '模板内容',
      dataIndex: 'content',
      key: 'content',
      render(__html: string) {
        return <div className="braft-output-content" dangerouslySetInnerHTML={{ __html }}></div>
      }
    },
    {
      title: '操作',
      width: 140,
      key: 'action',
      render(doc: any) {
        return (
          <Action
            data={doc}
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
            onEdit={onEdit.bind(null, doc)}
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
      <PageHeader ghost={false} title={`${currentManageProduct?.label}-模板管理`} />
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
                name: {
                  label: '问题名称',
                  widget: 'input',
                  placeholder: '请输入问题名称',
                  widgetProps: {
                    style: {
                      width: '150px'
                    }
                  },
                  options: []
                }
              }
            }
          }}
          columns={columnsRef.current as any}
          rowKey={(row: any) => `${row.id}`}
        />
      </Card>
    </>
  )
}

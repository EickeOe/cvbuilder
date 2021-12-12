import { Button, Card, PageHeader, Popconfirm, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import XTableRender from '@/components/XTableRender/XTableRender'
import { modal } from './Modal/Modal'
import { useAsyncFn } from 'react-use'
import { getSearchParams, usePersistFn } from '@gcer/react-air'
import { useRecoilValue } from 'recoil'
import { currentManageProductState } from '@/packages/developer/recoil'
import { fetchDocsApi, deleteDocApi } from '@/packages/developer/apis/doc'

function Action({ onEdit, onDel, data }: { data: any; onEdit(): void; onDel(): void }) {
  const [{ loading }, del] = useAsyncFn(async () => {
    await deleteDocApi(data.id)
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

export default function List() {
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
    return fetchDocsApi({
      parentId: key,
      name: p.name,
      pageInfo: {
        page: p.current,
        size: p.pageSize
      }
    }).then((res: any) => {
      return {
        list: res.docs.data,
        total: res.docs.totalCount
      }
    })
  }, [])

  const onEdit = usePersistFn((doc) => {
    modal({
      data: {
        doc
      },
      onOk() {
        xTableRef.current.refresh()
      }
    } as any)
  })

  const columnsRef = useRef([
    {
      title: '文档名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'URL',
      key: 'url',
      dataIndex: 'url'
    },
    {
      title: '操作',
      width: 200,
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
      <PageHeader ghost={false} title={`${currentManageProduct?.label}-文档管理`} />
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
                  label: '文档名称',
                  widget: 'input',
                  placeholder: '请输入文档名称',
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

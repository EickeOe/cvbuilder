import { Button, Card, PageHeader, Popconfirm, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import XTableRender from '@/components/XTableRender/XTableRender'
import { useAsync, useAsyncFn } from 'react-use'
import { getSearchParams, usePersistFn } from '@gcer/react-air'
import { modal } from './Modal/Modal'
import { fetchRoleListApi, fetchRoleUserListApi, removeLicenseApi } from 'developer/apis'
import { useRecoilValue } from 'recoil'
import { currentManageProductState } from '@/packages/developer/recoil'

function Action({ onEdit, onDel, data }: { data: any; onEdit(): void; onDel(): void }) {
  const [{ loading }, del] = useAsyncFn(async () => {
    const query = getSearchParams(location.search)
    await removeLicenseApi({
      id: data.id
    })
    onDel()
  }, [])
  return (
    <>
      {/* <Button type="link" onClick={onEdit}>
        编辑
      </Button> */}
      <Popconfirm title="确认删除?" onConfirm={del} okText="确定" cancelText="取消">
        <Button loading={loading} type="link">
          删除
        </Button>
      </Popconfirm>
    </>
  )
}

export default function AuthManage() {
  const currentManageProduct = useRecoilValue(currentManageProductState)
  const xTableRef = useRef<any>({
    reset() {},
    onQuery(..._: any) {},
    refresh() {},
    setList(..._: any) {},
    getCurrentList: () => []
  })

  // const { value: roleList = [] } = useAsync(() => {
  //   const { key } = getSearchParams(location.search)
  //   return fetchRoleListApi(key).then((list: any) =>
  //     list.map((item: any) => ({ value: item.roleId, label: item.roleName }))
  //   )
  // }, [])
  const roleList: any[] = []
  const api = useCallback(async (p) => {
    const { key } = getSearchParams(location.search)
    return fetchRoleUserListApi({
      key,
      pageInfo: {
        page: p.current,
        size: p.pageSize
      }
    }).then((res: any) => {
      console.log(res)
      return {
        list: res.app.licences.data,
        total: res.app.licences.totalCount
      }
    })
  }, [])

  const onEdit = usePersistFn((doc) => {
    // modal({
    //   data: {
    //     doc
    //   },
    //   onOk() {
    //     xTableRef.current.refresh()
    //   }
    // } as any)
  })

  const columnsRef = useRef([
    {
      title: '姓名',
      key: 'name',
      render(licence: any) {
        return licence.user.name
      }
    },

    {
      title: '角色',
      key: 'role',
      dataIndex: 'role'
    },
    {
      title: '操作',
      width: 200,
      key: 'action',
      render(licence: any) {
        return (
          <Action
            data={licence}
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
            onEdit={onEdit.bind(null, licence)}
          />
        )
      }
    }
  ])

  const onNewBtnClick = useCallback(() => {
    modal({
      data: {},
      onOk() {
        xTableRef.current.refresh()
      }
    } as any)
  }, [])

  return (
    <>
      <PageHeader ghost={false} title={`${currentManageProduct?.label}-权限管理`} />
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
                roleId: {
                  label: '角色',
                  widget: 'select',
                  placeholder: '请选择角色',
                  widgetProps: {
                    style: {
                      width: '150px'
                    }
                  },
                  options: roleList
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

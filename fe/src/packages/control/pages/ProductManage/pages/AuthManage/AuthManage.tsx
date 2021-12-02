import { Button, Card, PageHeader, Popconfirm, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import "./index.less";
import XTableRender from "@/components/XTableRender/XTableRender";
import { useAsync, useAsyncFn } from "react-use";
import { getSearchParams, usePersistFn } from "@gcer/react-air";
import { modal } from "./Modal/Modal";
import {
  deleteDocApi,
  fetchQAListApi,
  fetchRoleListApi,
  fetchRoleUserListApi,
} from "control/apis";

function Action({
  onEdit,
  onDel,
  data,
}: {
  data: any;
  onEdit(): void;
  onDel(): void;
}) {
  const [{ loading }, del] = useAsyncFn(async () => {
    await deleteDocApi(data.id);
    onDel();
  }, []);
  return (
    <>
      <Button type="link" onClick={onEdit}>
        编辑
      </Button>
      <Popconfirm
        title="确认删除?"
        onConfirm={del}
        okText="确定"
        cancelText="取消"
      >
        <Button loading={loading} type="link">
          删除
        </Button>
      </Popconfirm>
    </>
  );
}

export default function AuthManage() {
  const xTableRef = useRef<any>({
    reset() {},
    onQuery(..._: any) {},
    refresh() {},
    setList(..._: any) {},
    getCurrentList: () => [],
  });

  const { value: roleList = [] } = useAsync(() => {
    const { key } = getSearchParams(location.search);
    return fetchRoleListApi(key).then((list: any) =>
      list.map((item: any) => ({ value: item.roleId, label: item.roleName }))
    );
  }, []);
  const api = useCallback(async (p) => {
    return fetchRoleUserListApi(p.roleId).then((res: any) => {
      return {
        list: res,
      };
    });
  }, []);

  const onEdit = usePersistFn((doc) => {
    // modal({
    //   data: {
    //     doc
    //   },
    //   onOk() {
    //     xTableRef.current.refresh()
    //   }
    // } as any)
  });

  const columnsRef = useRef([
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "角色",
      key: "appId",
      dataIndex: "appId",
    },

    {
      title: "操作",
      width: 140,
      key: "action",
      render(auth: any) {
        return (
          <Action
            onEdit={() => {
              // modal({
              //   data: {
              //     isNew: false,
              //     auth
              //   },
              //   onOk() {
              //     xTableRef.current.refresh()
              //   }
              // } as any)
            }}
            onDel={xTableRef.current.refresh}
            data={auth}
          />
        );
      },
    },
  ]);

  const onNewBtnClick = useCallback(() => {
    modal({
      data: {},
      onOk() {
        xTableRef.current.refresh();
      },
    } as any);
  }, []);

  return (
    <>
      <PageHeader ghost={false} title="权限管理" />
      <Card bordered={false}>
        <XTableRender
          api={api}
          ref={xTableRef}
          extra={
            <>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onNewBtnClick}
              >
                新增
              </Button>
            </>
          }
          noFirstFetch
          xFormRender={{
            form: {
              type: "object",
              layout: "inline",
              properties: {
                roleId: {
                  label: "角色",
                  widget: "select",
                  placeholder: "请选择角色",
                  widgetProps: {
                    style: {
                      width: "150px",
                    },
                  },
                  options: roleList,
                },
              },
            },
          }}
          columns={columnsRef.current as any}
          rowKey={(row: any) => `${row.id}`}
        />
      </Card>
    </>
  );
}

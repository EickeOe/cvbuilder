import { Button, Card, PageHeader, Popconfirm, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import "./index.less";
import XTableRender from "@/components/XTableRender/XTableRender";
import { modal } from "./Modal/Modal";
import { useAsyncFn } from "react-use";
import { useSearchParams } from "@gcer/react-air";

export default function List() {
  const { id: appId }: any = useSearchParams();
  const xTableRef = useRef<any>({
    reset() {},
    onQuery(..._: any) {},
    refresh() {},
    setList(..._: any) {},
    getCurrentList: () => [],
  });

  const api = useCallback(async (p) => {}, [appId]);
  const columnsRef = useRef([
    {
      title: "资源名",
      dataIndex: "resource",
      key: "resource",
    },
    {
      title: "来源应用",
      key: "limitApp",
      dataIndex: "limitApp",
    },
  ]);

  const onNewBtnClick = useCallback(() => {
    modal({
      data: {
        isNew: true,
      },
      onOk() {
        xTableRef.current.refresh();
      },
    } as any);
  }, []);

  const [selectKeys, setSelectKeys] = useState<string[]>([]);

  return (
    <>
      <PageHeader ghost={false} title="文档管理" />
      <Card bordered={false}>
        <XTableRender
          noFirstFetch
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
          xFormRender={{
            form: {
              type: "object",
              layout: "inline",
              properties: {
                appCode: {
                  label: "应用",
                  widget: "select",
                  placeholder: "请选择应用",
                  options: [],
                },
                name: {
                  label: "文档名称",
                  widget: "input",
                  placeholder: "请输入名称",
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

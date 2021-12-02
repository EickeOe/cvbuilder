import UserSelect from "@/components/UserSelect/UserSelect";
import XFormRender from "@/components/NXFormRender/XFormRender";
import { fetchRoleListApi, postRole2UserApi } from "@/packages/control/apis";
import { createFuncModal, getSearchParams } from "@gcer/react-air";
import { Button, Drawer, Form, Modal as AModal, notification } from "antd";
import { useEffect, useMemo, useRef } from "react";
import { useAsync, useAsyncFn } from "react-use";

interface Props {
  visible: boolean;
  close: any;
  onOk: any;
  data: any;
}
export default function Modal({ visible, close, onOk, data }: Partial<Props>) {
  const { isNew } = data ?? {};
  const formRef = useRef<any>();

  useEffect(() => {}, [visible]);

  const { value: roleList = [] } = useAsync(() => {
    const { key } = getSearchParams(location.search);
    return fetchRoleListApi(key).then((list: any) =>
      list.map((item: any) => ({ value: item.roleId, label: item.roleName }))
    );
  }, []);
  const options = useMemo(
    () => ({
      type: "object",
      column: 1,
      labelLayout: {
        type: "horizontal",
        width: "100px",
      },
      properties: [
        {
          key: "userName",
          widget: "UserSelect",
          label: "用户",
          rules: [
            {
              required: true,
            },
          ],
          widgetProps: {
            mode: null,
          },
        },
        {
          key: "roleId",
          widget: "select",
          label: "角色",
          options: roleList,
          rules: [
            {
              required: true,
            },
          ],
          widgetProps: {
            style: {
              width: "100%",
            },
          },
        },
      ],
    }),
    [visible, roleList]
  );
  const title = isNew ? "新建" : "编辑";

  const [{ loading }, ok] = useAsyncFn(async () => {
    const values = await formRef.current.validate();
    values.userName = values.userName.value;
    await postRole2UserApi(values);
    onOk?.();
    close();
    notification.success({
      message: `${title}成功！`,
    });
  });
  return (
    <Drawer
      width={800}
      title={title}
      visible={visible}
      onClose={close}
      footer={
        <div
          style={{
            textAlign: "right",
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
    >
      <XFormRender
        options={options as any}
        ref={formRef}
        widgets={{ UserSelect }}
      />
    </Drawer>
  );
}
export const modal = createFuncModal(Modal);

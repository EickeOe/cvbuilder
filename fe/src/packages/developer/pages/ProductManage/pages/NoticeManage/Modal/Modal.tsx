import XFormRender from "@/components/NXFormRender/XFormRender";
import XDrawer from "@/components/XDrawer/Drawer";
import {
  postDocApi,
  postProductApi,
  putProductApi,
} from "@/packages/developer/apis";
import { createFuncModal, getSearchParams } from "@gcer/react-air";
import { Button, notification } from "antd";
import { useEffect, useMemo, useRef } from "react";
import { useAsyncFn } from "react-use";
import json from "./form.json";
import styles from "./index.module.less";

interface Props {
  data?: {
    doc?: any;
  };
  visible: boolean;
  onOk?(): void;
  close(): void;
}

export default function Modal({ visible, data, close, onOk }: Props) {
  const formRef = useRef<any>();

  const isNew = useMemo(() => {
    return !data?.doc;
  }, [data]);

  const formJson = useMemo(() => {
    return json;
  }, [isNew]);

  useEffect(() => {
    if (visible && data?.doc) {
      const doc = data.doc;
      formRef.current.setFieldsValue(doc);
    }
  }, [visible, data]);

  const [{ loading }, ok] = useAsyncFn(async () => {
    const { key } = getSearchParams();
    const values = await formRef.current.validate();

    const params = {
      ...values,
      id: data?.doc?.id,
      appCode: key,
    };
    console.log(params);

    await postDocApi(params);

    onOk?.();
    close();
    notification.success({
      message: `${isNew ? "新增" : "编辑"}文档成功！`,
    });
  }, [isNew, data]);
  return (
    <XDrawer
      width={800}
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
      title={`${isNew ? "新增" : "编辑"}文档`}
      placement="right"
      onClose={close}
      visible={visible}
    >
      <div className={styles.formWrap}>
        <XFormRender ref={formRef} options={formJson as any} />
      </div>
    </XDrawer>
  );
}
export const modal = createFuncModal(Modal);

import XFormRender from "@/components/NXFormRender/XFormRender";
import RichTextEditor from "@/components/RichTextEditor/RichTextEditor";
import XDrawer from "@/components/XDrawer/Drawer";
import { postTemplateApi } from "@/packages/developer/apis";
import { createFuncModal, getSearchParams } from "@gcer/react-air";
import { Button, notification } from "antd";
import { useEffect, useMemo, useRef } from "react";
import { useAsyncFn } from "react-use";
import json from "./form.json";
import styles from "./index.module.less";

interface Props {
  data?: {
    template?: any;
  };
  visible: boolean;
  onOk?(): void;
  close(): void;
}

export default function Modal({ visible, data, close, onOk }: Props) {
  const formRef = useRef<any>();

  const isNew = useMemo(() => {
    return !data?.template;
  }, [data]);

  const formJson = useMemo(() => {
    return json;
  }, [isNew]);

  useEffect(() => {
    if (visible && data?.template) {
      const template = data.template;
      formRef.current.setFieldsValue(template);
    }
  }, [visible, data]);

  const [{ loading }, ok] = useAsyncFn(async () => {
    const { key } = getSearchParams();
    const values = await formRef.current.validate();

    const params = {
      ...values,
      id: data?.template?.id,
      appCode: key,
    };

    await postTemplateApi(params);

    onOk?.();
    close();
    notification.success({
      message: `${isNew ? "新增" : "编辑"}模板成功！`,
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
      title={`${isNew ? "新增" : "编辑"}模板`}
      placement="right"
      onClose={close}
      visible={visible}
    >
      <div className={styles.formWrap}>
        <XFormRender
          ref={formRef}
          options={formJson as any}
          widgets={{ RichTextEditor }}
        />
      </div>
    </XDrawer>
  );
}
export const modal = createFuncModal(Modal);

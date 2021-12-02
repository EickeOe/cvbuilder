import XFormRender from "@/components/NXFormRender/XFormRender";
import { fetchProductListApi, putProductApi } from "@/packages/control/apis";
import { getSearchParams } from "@gcer/react-air";
import { Button, Card, notification, PageHeader } from "antd";
import { useEffect, useRef } from "react";
import { useAsync, useAsyncFn } from "react-use";

import formJson from "./form.json";
import styles from "./index.module.less";

export default function Detail() {
  const formRef = useRef<any>();
  const { value: detail } = useAsync(async () => {
    const { key } = getSearchParams(location.search);
    return fetchProductListApi({
      pageNum: 1,
      pageSize: 1,
      appCode: key,
    }).then((res: any) => {
      return res.data[0];
    });
  }, []);

  useEffect(() => {
    if (detail) {
      formRef.current.setFieldsValue(detail);
    }
  }, [detail]);

  const [{ loading }, submit] = useAsyncFn(async () => {
    const values = await formRef.current.validateAll();
    const params = {
      code: values.key,
      name: values.label,
      menuConfig: JSON.stringify(values),
    };

    await putProductApi(params);
    notification.success({
      message: `保存成功！`,
    });
  }, []);
  return (
    <>
      <PageHeader
        ghost={false}
        title={`${detail?.label}`}
        extra={
          <>
            <Button loading={loading} type="primary" onClick={submit}>
              保存
            </Button>
          </>
        }
      />
      <Card bordered={false}>
        <div className={styles.formWrap}>
          <XFormRender ref={formRef} options={formJson as any} />
        </div>
      </Card>
    </>
  );
}

import XFormRender from "@/components/NXFormRender/XFormRender";
import { fetchProductListApi, putProductApi } from "control/apis";
import { getSearchParams } from "@gcer/react-air";
import { Button, Card, notification, PageHeader } from "antd";
import { useEffect, useRef } from "react";
import { useAsync, useAsyncFn } from "react-use";
import formJson from "./form.json";
import styles from "./index.module.less";
import CodeEditor from "@/components/CodeEditor/CodeEditor";

export default function MenuManage() {
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
      detail.menus = JSON.stringify(detail.menus, null, "  ");
      formRef.current.setFieldsValue({
        ...(detail.menuConfig ?? {}),
        menus: JSON.stringify(detail.menuConfig?.menus ?? {}, null, "  "),
      });
    }
  }, [detail]);

  const [{ loading }, submit] = useAsyncFn(async () => {
    const values = await formRef.current.validate();

    const menuConfig = {
      ...values,
      menus: JSON.parse(values.menus),
    };
    delete detail.menus;
    const params = {
      code: detail.key,
      name: detail.label,
      menuConfig: JSON.stringify({
        ...detail,
        menuConfig,
      }),
    };
    console.log({
      ...detail,
      menuConfig,
    });
    await putProductApi(params);
    notification.success({
      message: `保存成功！`,
    });
  }, [detail]);
  return (
    <>
      <PageHeader
        ghost={false}
        title={`${detail?.label}-菜单管理`}
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
          <XFormRender
            ref={formRef}
            options={formJson as any}
            widgets={{ CodeEditor }}
          />
        </div>
      </Card>
    </>
  );
}

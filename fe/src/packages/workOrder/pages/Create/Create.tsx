import XFormRender from "@/components/NXFormRender/XFormRender";
import { postWorkOrderApi } from "@/packages/workOrder/apis";
import { microAppListState } from "@/recoil";
import { getSearchParams, useLocation } from "@gcer/react-air";
import { Button, Card, message, notification } from "antd";
import { useMemo, useRef } from "react";
import { useAsyncFn } from "react-use";
import { useRecoilValue } from "recoil";
// import options from './form.json'
import styles from "./index.module.less";

export default function Create() {
  const microAppList = useRecoilValue(microAppListState);
  const formRef = useRef<any>();

  const options = useMemo(() => {
    const productList = [
      {
        label: "CV Builder",
        value: "POIZON_CLOUD",
        path: "",
      },
      ...microAppList.map((app) => ({
        label: app.label,
        value: app.key,
        path: app.path,
      })),
    ];
    const currentProduct = getSearchParams(location.search).product;

    return {
      type: "object",
      column: 1,
      labelLayout: {
        type: "horizontal",
        width: "150px",
      },
      properties: [
        {
          key: "name",
          label: "标题",
          widget: "input",
          widgetProps: {
            maxLength: 50,
            placeholder: "标题输入限制50个字符",
          },
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          key: "appCode",
          label: "云产品",
          widget: "select",
          value:
            productList.filter((opt) => opt.path === currentProduct)?.[0]
              ?.value ?? "POIZON_CLOUD",
          widgetProps: {
            style: {
              width: "100%",
            },
            showSearch: true,
          },
          options: productList,
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          key: "level",
          label: "优先级",
          widget: "radiogroup",
          options: [
            {
              label: "P0",
              value: "P0",
            },
            {
              label: "P1",
              value: "P1",
            },
            {
              label: "P2",
              value: "P2",
            },
            {
              label: "P3",
              value: "P3",
            },
          ],
          rules: [
            {
              required: true,
            },
          ],
        },
        {
          key: "content",
          label: "描述问题",
          widget: "textarea",
          widgetProps: {
            rows: 10,
          },
          value: "【需求场景】\n\n\n\n【改进建议】\n\n",
          rules: [
            {
              required: true,
            },
          ],
        },
      ],
    };
  }, []);

  const [{ loading }, submit] = useAsyncFn(async () => {
    const values = await formRef.current.validate();
    const data: any = await postWorkOrderApi(values);
    await message.success("提交成功，准备跳转到飞书~", 1);
    window.open(
      `https://applink.feishu.cn/client/chat/open?openChatId=${data.chat_id}`
    );

    // let data = await saveClientConfig({
    //   appId: appId,
    //   configContent: {
    //     ...values
    //   },
    //   tenantId: tenantId
    // })
    // notification.success({
    //   message: `保存成功！`
    // })
  }, []);

  return (
    <>
      <Card bordered={false} className={styles.createWrap}>
        <div className="formWrap">
          <XFormRender ref={formRef} options={options as any} />
          <div style={{ paddingLeft: "150px" }}>
            <Button loading={loading} type="primary" onClick={submit}>
              提交
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}

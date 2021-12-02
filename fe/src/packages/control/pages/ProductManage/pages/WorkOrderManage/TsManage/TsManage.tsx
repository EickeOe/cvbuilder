import {
  Button,
  Card,
  notification,
  PageHeader,
  Popconfirm,
  Space,
} from "antd";
import "./index.less";
import { useAsync, useAsyncFn } from "react-use";
import XFormRender from "@/components/NXFormRender/XFormRender";
import formJson from "./form.json";
import { useEffect, useRef } from "react";
import { fetchTsListApi, postRosterApi } from "@/packages/control/apis";
import { getSearchParams } from "@gcer/react-air";
import UserSelect from "@/components/UserSelect/UserSelect";

export default function TsManage() {
  const formRef = useRef<any>();

  useEffect(() => {
    const { key } = getSearchParams(location.search);
    fetchTsListApi({
      appCode: key,
    }).then(({ data }) => {
      const obj =
        data[0]?.dutyUsers.reduce((duty: any, current: any) => {
          duty[current.level] = current.userNames.map(
            ({ userName, realName }: any) => ({
              value: userName,
              label: realName,
            })
          );
          return duty;
        }, {}) ?? {};
      formRef.current.setFieldsValue(obj);
    });
  }, []);

  const [{ loading }, submit] = useAsyncFn(async () => {
    const values = await formRef.current.validateAll().catch(console.log);
    const { key } = getSearchParams(location.search);
    const dutyUsers = Object.entries(values).map(([key, value]: any) => {
      return {
        userNames: value.map((val: any) => ({
          userName: val.value,
          realName: val.label,
        })),
        level: key,
      };
    });
    const params = {
      appCode: key,
      dutyUsers,
    };
    await postRosterApi(params);
    notification.success({
      message: `保存成功！`,
    });
  }, []);
  return (
    <>
      <PageHeader
        ghost={false}
        title="值班管理"
        extra={
          <>
            <Button loading={loading} type="primary" onClick={submit}>
              保存
            </Button>
          </>
        }
      />
      <Card bordered={false}>
        <XFormRender
          ref={formRef}
          options={formJson as any}
          widgets={{ UserSelect }}
        />
      </Card>
    </>
  );
}

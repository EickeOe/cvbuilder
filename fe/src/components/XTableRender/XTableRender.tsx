import { Form, TableProps } from "antd";
import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAsyncFn, usePrevious } from "react-use";
import { useLocation } from "react-router";
import XTable from "../XTable/XTable";
import "./index.less";
import XToolbar from "../XToolbar/XToolbar";
import {
  getNextState,
  getSearchParams,
  useAsyncState,
  usePersistFn,
  useSetSearchParams,
} from "@gcer/react-air";

interface Props<RecordType> extends TableProps<RecordType> {
  api(...rest: any): Promise<any>;
  localPagination?: boolean;
  noFirstFetch?: boolean;
  xFormRender?: {
    form: any;
  };
  extra?: ReactNode;
  tableAction?: any;
  disabledQuery?: boolean | Function;
}

export default forwardRef(function XTableRender<
  RecordType extends object = any
>(props: Props<RecordType>, ref: any) {
  const {
    columns,
    rowKey,
    api,
    localPagination = false,
    noFirstFetch = false,
    xFormRender,
    extra,
    tableAction,
    disabledQuery,
    ...tableProps
  } = props;

  const [form] = Form.useForm();
  const { search } = useLocation();

  const [params, setParams] = useAsyncState<{ [key: string]: any }>(() => {
    const query = getSearchParams(search);

    const { current = 1, pageSize = 10, ...nest } = query;
    const tem = xFormRender?.form.properties || {};
    const formParams: { [key: string]: any } = {};
    Object.keys(tem).forEach((key) => {
      formParams[key] = nest[key];
    });
    form.setFieldsValue(formParams);
    return {
      ...formParams,
      current: Number(current) || 1,
      pageSize: Number(pageSize) || 10,
    };
  });

  useSetSearchParams(params);

  const pApi = usePersistFn(api);
  const [
    {
      value: { total, list: _dataSource } = {
        total: 0,
        list: [],
      },
      loading,
    },
    fetch,
  ] = useAsyncFn<typeof pApi>((params) => pApi(params), []);

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setDataSource(_dataSource);
  }, [JSON.stringify(_dataSource)]);

  // TODO: 优化：区分本地分页和后端分页的函数
  // const valueRef = useRef({
  //   total:0,list:[]
  // })
  // const fetch = useCallback((params)=>api(params).then(v=>valueRef.current = v),[])

  const refresh = useCallback(async (fn: typeof setParams = async (p) => p) => {
    const nextParams = await fn(await getNextState(setParams));
    fetch(nextParams);
  }, []);

  const getListRef = useRef((v: typeof dataSource, _params: any) => {
    // fetch(p)
    return v;
  });

  const list = useMemo(
    () => getListRef.current(dataSource, params),
    [dataSource, params]
  );

  const listRef = useRef(list);

  listRef.current = list;

  useEffect(() => {
    // 是否首次渲染请求数据
    if (!noFirstFetch) {
      fetch({
        ...form.getFieldsValue(),
        ...params,
      });
    }

    // 是否使用本地本页，本地分页则将 dataSource 作为所有所有数据进行切割
    if (localPagination) {
      getListRef.current = (v: typeof dataSource, par: typeof params) => {
        const { current, pageSize } = par;
        return [...v].splice((current - 1) * pageSize, pageSize);
      };
    }
  }, []);

  const onQuery = useCallback(async (values = {}) => {
    const nextParams = await setParams((p) => {
      return {
        ...p,
        ...values,
        pageSize: p.pageSize,
        current: 1,
      };
    });
    fetch(nextParams);
  }, []);

  const reset = usePrevious(() => {
    form.resetFields();
    const resetParams = form.getFieldsValue();
    setParams(resetParams);
    fetch({
      ...resetParams,
      pageSize: params.pageSize,
      current: 1,
    });
  });
  useImperativeHandle(ref, () => {
    return {
      onQuery,
      reset,
      refresh,
      form,
      setList(...[fn]: Parameters<typeof setDataSource>) {
        setDataSource(fn);
      },
      getCurrentList() {
        return listRef.current;
      },
    };
  });

  return (
    <div className="clusterList">
      <XToolbar
        disabledQuery={disabledQuery}
        form={form}
        onQuery={onQuery}
        formOptions={xFormRender?.form}
        extra={extra}
      />
      {/* <div className="toolbar" style={{ marginBottom: 20 }}>
        <div className="queryWrap">
          {xFormRender?.form && (
            <>
              <XFormRender
                options={xFormRender?.form}
                form={form}
                formProps={{
                  onFinish: onQuery
                }}
              />

              <Button
                className="queryBtn"
                type="primary"
                onClick={async () => {
                  const values = await form.validateFields()
                  onQuery(values)
                }}
              >
                查询
              </Button>
            </>
          )}
        </div>
        {extra && <div className="extraWrap">{extra}</div>}
      </div> */}
      <div className="content">
        {tableAction}
        <XTable
          size="small"
          bordered
          loading={loading}
          columns={columns}
          dataSource={list}
          rowKey={rowKey}
          pagination={{
            total,
            ...params,
            async onChange(page, pageSize) {
              const resetParams = form.getFieldsValue();
              const nextParams = await setParams({
                ...resetParams,
                current: page,
                pageSize: pageSize || params.pageSize,
              });
              if (!localPagination) {
                fetch(nextParams);
              }
            },
            showTotal: (total) => `共 ${total} 条`,
            showQuickJumper: true,
            showSizeChanger: true,
          }}
          {...(tableProps as any)}
        />
      </div>
    </div>
  );
});

// function NTable(){
//   return <ProTable<TableListItem>
//   columns={columns}
//   request={(params, sorter, filter) => {
//     // 表单搜索项会从 params 传入，传递给后端接口。
//     console.log(params, sorter, filter);
//     return Promise.resolve({
//       data: tableListDataSource,
//       success: true,
//     });
//   }}
//   rowKey="key"
//   pagination={{
//     showQuickJumper: true,
//   }}
//   search={{
//     layout: 'vertical',
//     defaultCollapsed: false,
//   }}
//   dateFormatter="string"
//   toolbar={{
//     title: '高级表格',
//     tooltip: '这是一个标题提示',
//   }}
//   toolBarRender={() => [
//     <Button key="danger" danger>
//       危险按钮
//     </Button>,
//     <Button key="show">查看日志</Button>,
//     <Button type="primary" key="primary">
//       创建应用
//     </Button>,
//     <Dropdown key="menu" overlay={menu}>
//       <Button>
//         <EllipsisOutlined />
//       </Button>
//     </Dropdown>,
//   ]}
// />
// }

import { Form } from "antd";
import { get, set, sortedUniqBy } from "lodash-es";
import {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import {
  calculation,
  checkType,
  clone,
  computeOptions,
  computeSomeResult,
  computeValidateRules,
  flattenSchema,
  getDataPath,
  getDescriptorFromSchema,
  getLabelProps,
  getSchemaFromFlatten,
  getValueByPath,
  getWidgetName,
  isExpression,
  isListType,
  isObjType,
  isRelational,
  isTernary,
  parseAllExpression,
  relationalReg,
  schemaContainsExpression,
  ternaryReg,
  translateMessage,
  validateAll as validateAllUtil,
} from "./utils";
import { defaultWidgetMap, Tooltip } from "./widget";
import "./index.less";
import { FC } from "react";
import { createUseContext, useUpdater, usePersistFn } from "@gcer/react-air";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { forwardRef } from "react";
import TableList from "./TableList";

const [Provider, useFormContext] = createUseContext({
  flatten: {},
  formData: {},
  errorFields: [],
  widgets: {},
  onValueChange: (..._: any) => {},
  onFieldChange: (..._: any) => {},
});

const [FormStyleProvider, useFormStyleContext] = createUseContext({
  fieldStyle: {},
  labelStyle: {},
  globalStyle: {},
});

type ParmaType<F extends (...args: any) => any> = Parameters<F>[0];
function RenderObject({
  children = [],
  dataIndex = [],
  displayType,
  hideTitle,
}: ParmaType<FC<any>>) {
  return (
    <>
      {children?.map((child: any, i: any) => {
        const FRProps = {
          displayType,
          id: child,
          dataIndex,
          hideTitle,
        };
        return <Render key={i.toString()} {...FRProps} />;
      })}
    </>
  );
}

const RenderList: FC<any> = ({
  children = [],
  id,
  schema = {},
  dataIndex = [],
  displayType,
  hideTitle,
}: ParmaType<FC<any>>) => {
  const { flatten, formData, onFieldChange }: any = useFormContext();

  const dataPath = getDataPath(id, dataIndex);
  let listData;
  if (typeof dataPath === "string") {
    // TODO: listData会有不少“窟窿”，submit 的时候，listData 需要补齐 or filter
    listData = get(formData, dataPath);
  }
  const displayList = Array.isArray(listData) ? listData : [{}];

  let itemSchema = {
    type: "object",
    // properties: (schema.items && schema.items.properties) || {},
    properties: {},
    props: schema.props || {},
    $id: schema.$id,
  };
  const itemFlatten = {
    schema: itemSchema,
    children,
  };

  const getFieldsProps = (idx: number, extraProps = {}) => {
    return {
      _item: itemFlatten,
      dataIndex: [...dataIndex, idx],
      ...extraProps,
    };
  };

  const onItemChange = (path: string, newList: any[]) => {
    onFieldChange(path, newList);
  };

  const changeList = (newList: any[]) => {
    onItemChange(dataPath, newList);
  };

  const addItem = () => {
    const newList = [...displayList, {}];
    const newIndex = newList.length - 1;
    onItemChange(dataPath, newList);
    return newIndex;
  };

  const copyItem = (idx: number) => {
    const newItem = displayList[idx];
    const newList = [
      ...displayList.slice(0, idx),
      newItem,
      ...displayList.slice(idx),
    ];
    onItemChange(dataPath, JSON.parse(JSON.stringify(newList)));
  };

  const deleteItem = (idx: number) => {
    // TODO: 删除元素的时候，也需要delete相对于的校验信息（errorFields）
    // remark: 删除时，不存在的item需要补齐，用null
    const newList = displayList.filter((item, kdx) => kdx !== idx);
    onItemChange(dataPath, newList);
    // removeTouched(`${dataPath}[${idx}]`);
  };

  const props = {
    displayList,
    addItem,
    copyItem,
    deleteItem,
    changeList,
    getFieldsProps,
    hideTitle,
  };

  return (
    <>
      <TableList {...props} />
    </>
  );
};

function ErrorMessage({ message, schema }: any) {
  let msg = "";
  if (typeof message === "string") msg = message;
  if (Array.isArray(message)) {
    msg = message[0] || "";
  }

  msg = translateMessage(msg, schema);

  // if (hardHidden) return <div className={`error-message`}></div>

  return !msg ? null : <div className="errorMessage">{msg}</div>;
}

function RenderField({
  children,
  id,
  schema,
  dataPath,
  dataIndex,
  value,
  errorFields = [],
}: any) {
  const { widgets, onValueChange, onFieldChange }: any = useFormContext();
  const { fieldStyle, labelStyle }: any = useFormStyleContext();
  let widgetName = getWidgetName(schema);
  const Widget = widgets[widgetName] || (() => <></>);
  const errObj = errorFields.find((err: any) => err.name === dataPath);
  const errorMessage = errObj && errObj.error; // 是一个list
  const hasError = Array.isArray(errorMessage) && errorMessage.length > 0;
  // 补上这个class，会自动让下面所有的展示ui变红！
  const showValidate = true;
  const _contentClass = "";
  const contentClass =
    hasError && showValidate
      ? _contentClass + " ant-form-item-has-error"
      : _contentClass;

  const onChange = (value: any) => {
    if (typeof dataPath === "string") {
      onFieldChange(dataPath, value);
    }
  };
  if (id === "#") {
    return (
      <Widget schema={schema} value={value} onChange={onChange}>
        {children}
      </Widget>
    );
  }

  const { rules = [], widget, tooltip = "", width = fieldStyle.width } = schema;
  let required = false;
  if (rules?.length) {
    required = rules.some((rule: any) => rule.required);
  }

  let hideLabel = false;

  if (widget === "divider") {
    hideLabel = true;
    return (
      <div className="field" style={{ ...fieldStyle, width }}>
        <div className={`widgetWrap ${contentClass}`}>
          <div className="widget">
            <Widget
              dataIndex={dataIndex}
              schema={schema}
              value={value}
              onChange={onChange}
            >
              {children}
            </Widget>
          </div>
        </div>
      </div>
    );
  }

  const messageProps = {
    message: errorMessage,
    schema,
  };

  return (
    <div className="field" style={{ ...fieldStyle, width }}>
      {!hideLabel && schema.label && (
        <div
          className={`label ${required ? "required" : ""}`}
          style={labelStyle}
        >
          {schema.label}&nbsp;
          {tooltip && (
            <Tooltip title={tooltip}>
              <QuestionCircleOutlined className="tooltip" />
            </Tooltip>
          )}
        </div>
      )}
      <div className={`widgetWrap ${contentClass}`}>
        <div className="widget">
          <Widget
            schema={schema}
            {...(schema.widgetProps ?? {})}
            value={value}
            onChange={onChange}
          >
            {children}
          </Widget>
        </div>
        <ErrorMessage {...messageProps} />
      </div>
    </div>
  );
}

export function Render({ id = "#", _item, dataIndex = [] }: any) {
  const { flatten, formData, errorFields }: any = useFormContext();
  const item = _item ? _item : flatten[id];
  if (!item) {
    return null;
  }
  let dataPath = getDataPath(id, dataIndex);
  const _value = getValueByPath(formData, dataPath);
  const schema = item.schema;

  if (schema.hidden) {
    return null;
  }

  const isObj = isObjType(schema);

  let _children = null;
  if (isObj) {
    _children = (
      <RenderObject dataIndex={dataIndex}>{item.children}</RenderObject>
    );
  }

  const isList = isListType(schema);

  if (isList) {
    _children = (
      <RenderList dataIndex={dataIndex} id={id} schema={schema}>
        {item.children}
      </RenderList>
    );
  }

  return (
    <RenderField
      dataIndex={dataIndex}
      errorFields={errorFields}
      id={id}
      value={_value}
      dataPath={dataPath}
      schema={schema}
    >
      {_children}
    </RenderField>
  );
}

export default forwardRef(function XFormRender(props: FormProps, ref) {
  const { options, formProps = {}, widgets, onChange = () => {} } = props;

  const {
    column = 1,
    layout = "vertical",
    labelLayout = {
      type: "vertical",
      align: "right",
    },
    properties,
  }: any = options;

  const globalStyle = useMemo(() => {
    const itemStyle: Partial<CSSProperties> = {};
    if (layout !== "inline") {
      itemStyle.width = `${Math.floor((1 / column) * 10000) / 100}%`;
    } else {
      itemStyle.marginRight = 16;
    }
    return itemStyle;
  }, [layout]);

  const fieldStyle = useMemo(() => {
    const style: Partial<CSSProperties> = {};
    const width = `${Math.floor((1 / column) * 10000) / 100}%`;
    const { type, align } = labelLayout;
    if (type === "horizontal") {
      style.flexDirection = "row";
    } else {
      style.flexDirection = "column";
    }

    style.width = width;

    return style;
  }, [JSON.stringify(labelLayout)]);

  const labelStyle = useMemo(() => {
    const style: Partial<CSSProperties> = {};
    const { type, width, align } = labelLayout;
    if (width) {
      style.width = width;
    }
    return style;
  }, [JSON.stringify(labelLayout)]);

  // const initValue = useMemo(() => {
  //   return properties?.reduce?.((prev: any, { key, ...val }: any) => {
  //     if (val?.hasOwnProperty?.('initialValue')) {
  //       prev[key] = val.initialValue
  //     }
  //     return prev
  //   }, {})
  // }, [])
  const widgetMap = useMemo(
    () => ({ ...widgets, ...defaultWidgetMap }),
    [widgets]
  );

  const flattenRef = useRef({});
  const updater = useUpdater();

  const [formData, setFormData] = useState(
    properties.reduce((prev: any, property: any) => {
      if (property?.hasOwnProperty?.("initialValue")) {
        prev[property.key] = property.initialValue;
      }
      if (property?.hasOwnProperty?.("value")) {
        prev[property.key] = property.value;
      }
      return prev;
    }, {})
  );

  // useEffect(() => {
  //   onChange(formData)
  // }, [JSON.stringify(formData)])

  const onEventChange = usePersistFn((data, prevData) => {
    setFormData(data);
    formDataRef.current = data;
    onChange(data, prevData);
  });
  const onCodeChange = usePersistFn((data) => {
    setFormData(data);
    formDataRef.current = data;
  });

  const formDataRef = useRef(formData);

  const [errorFields, setErrorFields] = useState([]);

  const errorFieldsRef = useRef(errorFields);

  const onFieldChange = usePersistFn((path, value) => {
    const prevData = clone(formDataRef.current);
    if (typeof path !== "string") return;
    if (path === "#") {
      onEventChange({ ...value }, prevData);
      return;
    }
    set(formDataRef.current ?? {}, path, value);

    onEventChange({ ...formDataRef.current }, prevData);
  });

  const onValueChange = usePersistFn((e) => {
    console.log(e, 1);
  });

  useEffect(() => {
    const flatten = flattenSchema(options);
    let newFlatten = clone(flatten);
    Object.entries(newFlatten).forEach(([path, info]: any) => {
      if (schemaContainsExpression(info.schema)) {
        newFlatten[path].schema = parseAllExpression(
          info.schema,
          formDataRef.current,
          path
        );
      }
    });
    flattenRef.current = newFlatten;
    updater();
  }, [JSON.stringify(options), JSON.stringify(formDataRef.current)]);

  const validateAll = usePersistFn(async () => {
    const arr = await validateAllUtil({
      flatten: flattenRef.current,
      formData: formDataRef.current,
    });
    if (arr.length > 0) {
      setErrorFields(arr as any);
      throw arr;
    }

    return formDataRef.current;
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        validate: validateAll,
        validateAll,
        setFieldsValue: (data: any = {}) => {
          onCodeChange({ ...data });
        },
        setFieldValue: (data: any = {}) => {
          onCodeChange({ ...formDataRef.current, ...data });
        },
      };
    },
    []
  );

  return (
    <div className="xFormRender">
      <Provider
        value={{
          flatten: flattenRef.current,
          formData,
          errorFields,
          widgets: widgetMap,

          onValueChange,
          onFieldChange,
        }}
      >
        <FormStyleProvider value={{ fieldStyle, globalStyle, labelStyle }}>
          <form onSubmit={() => {}}>
            <Render flatten={flattenRef.current} />
          </form>
        </FormStyleProvider>
      </Provider>
    </div>
  );
});

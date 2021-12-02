import { Form } from "antd";
import { CSSProperties, forwardRef, useImperativeHandle, useMemo } from "react";
import {
  calculation,
  checkType,
  computeOptions,
  computeResult,
  computeSomeResult,
  computeValidateRules,
  getLabelProps,
  isExpression,
  isRelational,
  isTernary,
  relationalReg,
  ternaryReg,
} from "./utils";
import { defaultWidgetMap } from "./widget";
import "./index.less";
import { FC } from "react";
import { usePersistFn, useUpdater } from "@gcer/react-air";

interface Rule {}

interface FormProps {
  options: FormOptions;
  form?: any;
  formProps?: any;
  widgets?: {
    [key: string]: FC<{ value: any; onChange: any }>;
  };
}

export default forwardRef(function XForm(props: FormProps, ref) {
  const { options, form: pForm, formProps = {}, widgets } = props;

  const {
    column = 1,
    layout = "vertical",
    labelLayout = {
      type: "horizontal",
      align: "right",
    },
    properties,
  } = options;

  const itemStyle: Partial<CSSProperties> = {};
  if (layout !== "inline") {
    itemStyle.width = `${Math.floor((1 / column) * 10000) / 100}%`;
  } else {
    itemStyle.marginRight = 16;
  }
  const [form] = Form.useForm(pForm);

  const initValue = useMemo(() => {
    return Object.entries(properties).reduce((prev: any, [key, val]: any) => {
      if (val?.hasOwnProperty?.("initialValue")) {
        prev[key] = val.initialValue;
      }
      return prev;
    }, {});
  }, []);

  const widgetMap = useMemo(
    () => ({ ...widgets, ...defaultWidgetMap }),
    [widgets]
  );
  const updater = useUpdater();
  const setFieldsValue = usePersistFn(
    (...[rest]: Parameters<typeof form.setFieldsValue>) => {
      form.setFieldsValue(rest);
      updater();
    }
  );
  useImperativeHandle(
    ref,
    () => {
      return {
        setFieldsValue,
      };
    },
    []
  );

  return (
    <div className="xFormRender">
      <Form
        form={form}
        initialValues={initValue}
        {...formProps}
        layout={labelLayout.type}
      >
        {Object.entries(properties).map(([key, val]: any, index) => {
          const style: Partial<CSSProperties> = {
            ...itemStyle,
            padding: "0 8px",
            width: val.width ?? itemStyle.width,
          };

          const Comp = (widgetMap as any)[(val.widget as any) ?? "input"] ?? (
            <></>
          );

          // 提前排除掉分割线等UI组件,避免多余计算

          const {
            label = "",
            options = [],
            widgetProps = {},
            hidden = [],
            tooltip,
          } = val;

          const shouldUpdateFieldList: any[] = [];
          let isLabelInvalid = true;
          let isOptionsInvalid = true;
          let isHiddenInvalid = true;
          let isPlaceholderInvalid = true;
          let astRelationalMap = {
            left: "",
            right: "",
            operator: "",
            trueResult: "",
            falseResult: "",
          };
          if (isExpression(label)) {
            isLabelInvalid = false;

            const expression = label.substring(2, label.length - 2);

            if (isTernary(expression)) {
              const ternary = expression
                .split(ternaryReg)
                .filter((s: any) => s.trim() !== "");
              const [relational, trueResult, falseResult] = ternary;
              const [, trueResultStr] = checkType(trueResult);
              const [, falseResultStr] = checkType(falseResult);
              Object.assign(astRelationalMap, {
                trueResult: trueResultStr,
                falseResult: falseResultStr,
              });

              if (isRelational(relational)) {
                const [left, right] = relational
                  .split(relationalReg)
                  .filter((s: any) => s.trim() !== "");
                const operator = relational
                  .replace(left, "")
                  .replace(right, "");
                Object.assign(astRelationalMap, { left, operator, right });
                let [lType, lVal]: any = checkType(left);
                let [rType, rVal]: any = checkType(right);
                if (lType === "field") {
                  shouldUpdateFieldList.push(lVal);
                }
                if (rType === "field") {
                  shouldUpdateFieldList.push(rVal);
                }
              }
            }
          }
          if (options.length > 0) {
            if (options[0].hasOwnProperty("rules")) {
              isOptionsInvalid = false;
              shouldUpdateFieldList.push(
                ...options
                  .map((option: any) =>
                    option.rules.map((rule: any) => rule.field)
                  )
                  .flat()
              );
            }
          }

          if (hidden.length > 0) {
            isHiddenInvalid = false;
            shouldUpdateFieldList.push(
              ...hidden.map((rule: any) => rule.field)
            );
          }
          if (widgetProps.placeholder instanceof Array) {
            if (widgetProps.placeholder[0].hasOwnProperty("rules")) {
              isPlaceholderInvalid = false;
              shouldUpdateFieldList.push(
                ...widgetProps.placeholder
                  .map((option: any) =>
                    option.rules.map((rule: any) => rule.field)
                  )
                  .flat()
              );
            }
          }

          return (
            <div key={key} style={{ ...style }}>
              <Form.Item noStyle dependencies={shouldUpdateFieldList}>
                {({ getFieldsValue }) => {
                  const formData = { ...initValue, ...getFieldsValue() };
                  // console.log(initValue)

                  const labelStr = isLabelInvalid
                    ? label
                    : calculation(
                        formData,
                        astRelationalMap.left,
                        astRelationalMap.operator,
                        astRelationalMap.right
                      )
                    ? astRelationalMap.trueResult
                    : astRelationalMap.falseResult;

                  const optionList = isOptionsInvalid
                    ? options
                    : computeOptions(formData, options);

                  const placeholder = isPlaceholderInvalid
                    ? widgetProps.placeholder
                    : computeResult(formData, widgetProps.placeholder);

                  const hiddenBool = isHiddenInvalid
                    ? false
                    : computeSomeResult(formData, hidden);

                  const rules = hiddenBool
                    ? []
                    : computeValidateRules({ ...val, label: labelStr });
                  // TODO:
                  if (val.widget === "divider") {
                    return <Comp key={key} {...val} />;
                  }
                  return (
                    <Form.Item
                      tooltip={
                        tooltip
                          ? {
                              title: (
                                <>
                                  {tooltip?.split("\n").map((v: string) => (
                                    <div>{v}</div>
                                  ))}
                                </>
                              ),
                            }
                          : null
                      }
                      label={labelStr}
                      {...getLabelProps(labelLayout, val.labelLayout)}
                      hidden={hiddenBool}
                      name={key}
                      rules={rules}
                    >
                      <Comp
                        {...val}
                        widgetProps={{ ...widgetProps, placeholder }}
                        options={optionList}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </div>
          );
        })}
      </Form>
    </div>
  );
});

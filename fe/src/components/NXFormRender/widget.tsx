import {
  Divider,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Radio,
  Switch,
  Tooltip as ATooltip,
  AutoComplete,
  Space,
  Button
} from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'

const { RangePicker } = DatePicker

export const defaultWidgetMap = {
  input: (props: any) => {
    const { hidden, schema: { widgetProps = {} } = {}, value, onChange, ...prop } = props
    const { after, before, options } = widgetProps ?? {}
    const [ops, setOps] = useState(options)
    const opsRef = useRef(options)
    useEffect(() => {
      opsRef.current = options
      setOps(options)
    }, [JSON.stringify(options)])
    const onSearch = (val: string) => {
      const next = [...(opsRef.current ?? [])].filter(({ label }: { label: string }) => label.includes(val))
      setOps(next)
    }

    if (!options) {
      return (
        <Input
          {...prop}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          addonBefore={before}
          addonAfter={after}
          style={{ width: '100%' }}
          {...widgetProps}
        />
      )
    } else {
      return (
        <AutoComplete
          {...prop}
          value={value}
          onChange={onChange}
          options={ops}
          onSearch={onSearch}
          addonBefore={before}
          addonAfter={after}
          style={{ width: '100%' }}
          {...widgetProps}
        />
      )
    }
  },
  radiogroup: (props: any) => {
    const {
      schema: { options = [], widgetProps = {} },
      value,
      onChange
    } = props
    return (
      <Radio.Group {...widgetProps} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((op: { value: any; label: string; tooltip: string; disabled: boolean }) => {
          return (
            <Radio key={op.value} value={op.value} disabled={op.disabled}>
              {op.tooltip ? <Tooltip title={op.tooltip}>{op.label}</Tooltip> : op.label}
            </Radio>
          )
        })}
      </Radio.Group>
    )
  },
  'radiogroup.button': (props: any) => {
    const {
      schema: { options = [], widgetProps = {} },
      value,
      onChange
    } = props
    return (
      <Radio.Group {...widgetProps} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((op: { value: any; label: string; tooltip: string; disabled: boolean }) => {
          return (
            <Radio.Button key={op.value} value={op.value} disabled={op.disabled}>
              {op.tooltip ? <Tooltip title={op.tooltip}>{op.label}</Tooltip> : op.label}
            </Radio.Button>
          )
        })}
      </Radio.Group>
    )
  },
  inputNumber: (props: any) => {
    const {
      hidden,
      initialValue,
      schema: { widgetProps = {} },
      value,
      onChange,
      ...prop
    } = props

    const { after, before } = widgetProps ?? {}
    return (
      <InputNumber
        {...prop}
        {...widgetProps}
        addonBefore={before}
        addonAfter={after}
        value={value}
        onChange={onChange}
        style={{ width: '100%' }}
      />
    )
  },
  switch: (props: any) => {
    const {
      onChange,
      value,
      schema: { widgetProps = {} },
      onClick
    } = props
    return <Switch checked={value} {...widgetProps} onChange={onChange} onClick={onClick} />
  },
  rangePicker: (props: any) => {
    const {
      schema: { widgetProps = {} },
      value,
      onChange
    } = props
    return <RangePicker showTime {...widgetProps} value={value} onChange={onChange} />
  },
  divider: (props: any) => {
    const {
      schema: { label, widgetProps = {} }
    } = props
    return (
      <Divider {...widgetProps} plain>
        {label}
      </Divider>
    )
  },
  select: (props: any) => {
    const {
      label,
      width,
      schema: { options = [], widgetProps = {} },
      value,
      onChange,
      ...p
    } = props
    return <Select {...widgetProps} value={value} onChange={onChange} options={options}></Select>
  },
  textarea: (props: any) => {
    const {
      label,
      width,
      schema: { widgetProps = {} },
      value,
      onChange,
      ...p
    } = props
    return <Input.TextArea {...widgetProps} value={value} onChange={(e) => onChange(e.target.value)}></Input.TextArea>
  },
  object: (props: any) => {
    return <div className="object">{props.children}</div>
  },
  // TODO: 未完成，请勿使用
  action: () => {
    return (
      <Space>
        <Button>提交</Button>
        <Button>重置</Button>
      </Space>
    )
  },
  array: (props: any) => {
    return <div className="list">{props.children}</div>
  }
}

export const requiredDefaultMsgMap = {
  text: '请输入${label}!',
  radiogroup: '请选择${label}!',
  inputNumber: '请输入${label}!',
  switch: '请选择${label}!'
}

export function Tooltip({ title = '', children, ...props }: { children: any; title: string }) {
  const t = useMemo(() => {
    return title.split('\n').map((v: string) => <div>{v}</div>)
  }, [title])
  return (
    <ATooltip title={t} {...props}>
      {children}
    </ATooltip>
  )
}

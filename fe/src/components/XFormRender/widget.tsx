import { Divider, Form, Input, Select, DatePicker, InputNumber, Radio, Switch, AutoComplete } from 'antd'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Tooltip } from '../NXFormRender/widget'

const { RangePicker } = DatePicker

export const defaultWidgetMap = {
  input: (props: any) => {
    const { hidden, widgetProps = {}, value, onChange, ...prop } = props
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
          {...widgetProps}
          value={value}
          addonBefore={before}
          addonAfter={after}
          onChange={onChange}
          style={{ width: '100%' }}
        />
      )
    } else {
      return (
        <AutoComplete
          {...prop}
          {...widgetProps}
          value={value}
          onChange={onChange}
          options={ops}
          onSearch={onSearch}
          addonBefore={before}
          addonAfter={after}
          style={{ width: '100%' }}
        />
      )
    }
  },
  radiogroup: (props: any) => {
    const { widgetProps = {}, options = [], value, onChange } = props
    return (
      <Radio.Group {...widgetProps} value={value} onChange={onChange}>
        {options.map((op: { value: any; label: string; tooltip: string; disabled: boolean }) => {
          return (
            <Radio key={op.value} disabled={op.disabled} value={op.value}>
              {op.tooltip ? <Tooltip title={op.tooltip}>{op.label}</Tooltip> : op.label}
            </Radio>
          )
        })}
      </Radio.Group>
    )
  },
  inputNumber: (props: any) => {
    const { hidden, initialValue, widgetProps = {}, value, onChange, ...prop } = props
    return <InputNumber {...prop} {...widgetProps} value={value} onChange={onChange} style={{ width: '100%' }} />
  },
  switch: (props: any) => {
    const { onChange, value, widgetProps = {}, onClick } = props
    return <Switch checked={value} {...widgetProps} onChange={onChange} onClick={onClick} />
  },
  rangePicker: (props: any) => {
    const { widgetProps = {}, value, onChange } = props
    return <RangePicker showTime {...widgetProps} value={value} onChange={onChange} />
  },
  divider: (props: any) => {
    const { label, widgetProps = {} } = props
    return (
      <Divider {...widgetProps} plain>
        {label}
      </Divider>
    )
  },
  select: (props: any) => {
    const { label, width, widgetProps = {}, value, onChange, options = [], ...p } = props
    return (
      <Select {...widgetProps} value={value} onChange={onChange} options={options}>
        {label}
      </Select>
    )
  }
}

export const requiredDefaultMsgMap = {
  text: '请输入${label}!',
  radiogroup: '请选择${label}!',
  inputNumber: '请输入${label}!',
  switch: '请选择${label}!'
}

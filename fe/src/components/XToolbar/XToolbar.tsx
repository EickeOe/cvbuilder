import { Button, Form } from 'antd'
import { useEffect, useState } from 'react'
import XFormRender from '../XFormRender/XFormRender'
import './index.less'

interface Props {
  form?: any
  formOptions: any
  extra?: any
  onQuery: any
  disabledQuery?: boolean | Function
}

export default function XToolbar({ form, formOptions, extra, onQuery, disabledQuery }: Props) {
  const [f] = Form.useForm(form)

  const [disabled, setDisabled] = useState(() => {
    if (typeof disabledQuery === 'boolean') {
      return disabledQuery
    }
    if (typeof disabledQuery === 'function') {
      return disabledQuery(f.getFieldsValue())
    }
  })
  useEffect(() => {
    if (typeof disabledQuery === 'boolean') {
      setDisabled(disabledQuery)
    }
    // if (typeof disabledQuery === 'function') {
    //   return disabledQuery(f.getFieldsValue())
    // }
  }, [disabledQuery])

  return (
    <div className="toolbar" style={{ marginBottom: 20 }}>
      <div className="queryWrap">
        {formOptions && (
          <>
            <XFormRender
              options={formOptions}
              form={f}
              formProps={{
                onFinish: onQuery,
                onFieldsChange: async () => {
                  if (typeof disabledQuery === 'function') {
                    const next = await disabledQuery(f.getFieldsValue())
                    setDisabled(next)
                  }
                }
              }}
            />

            <Button
              className="queryBtn"
              type="primary"
              disabled={disabled}
              onClick={async () => {
                const values = await f.validateFields()
                onQuery(values)
              }}
            >
              查询
            </Button>
          </>
        )}
      </div>
      {extra && <div className="extraWrap">{extra}</div>}
    </div>
  )
}

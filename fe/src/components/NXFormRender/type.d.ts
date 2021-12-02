interface LabelLayout {
  type?: 'vertical' | 'horizontal'
  width?: string | number
  align?: 'left' | 'right'
}

interface FormProps {
  options: any
  formProps?: any
  onChange?(formData: any, prevFormData: any): void
  widgets?: {
    [key: string]: FC<{ value: any; onChange: any }>
  }
}

interface Expression {}

interface ExpressionRule extends Object {
  mode: 'some' | 'every'
  filter: {
    field: string
    method: string
    value: any[]
  }[]
  result: any
}

type Icon = string
interface Property {
  key?: string
  label?: string
  type?: 'object' | 'array'
  widget?:
    | 'select'
    | 'input'
    | 'textarea'
    | 'radiogroup'
    | 'inputNumber'
    | 'switch'
    | 'rangePicker'
    | 'divider'
    | string
  widgetProps?: {
    placeholder?: string
    style?: Partial<CSSProperties>
    before?: Property | string | Icon
    after?: Property | string | Icon
    min: number
    max: number
  }
  labelLayout?: LabelLayout
  width?: number | string
  options?:
    | {
        label: string
        value: string | number | boolean
      }[]
    | any
  placeholder?: string
  initialValue?: any
  value?: any
  hidden?: boolean | ExpressionRule | ExpressionRule[]
  tooltip?: string
  disabled?: any
  rules?: any[]
  properties?: Property[]
}

interface FormOptions {
  type: 'object'
  column?: number
  layout?: 'inline' | 'vertical' | 'horizontal'
  labelLayout?: LabelLayout
  properties: Property[]
}

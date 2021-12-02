interface LabelLayout {
  type?: 'vertical' | 'horizontal'
  width?: string | number
  align?: 'left' | 'right'
}

interface Property {
  label?: string
  widget: 'select' | 'input' | 'radiogroup' | 'inputNumber' | 'switch' | 'rangePicker' | 'divider' | string
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
  hidden?: any
  tooltip?: string
  disabled?: any
  rules?: any[]
}

interface FormOptions {
  column?: number
  layout?: 'inline' | 'vertical' | 'horizontal'
  labelLayout?: LabelLayout
  properties: any
}

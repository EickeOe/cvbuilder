import { requiredDefaultMsgMap } from './widget'

const expressionReg = /^{{(.*)}}$/

export const ternaryReg = /([^?]*)\?([^:]*):([^;]*)/

export const relationalReg = /^(.*)(?:<=?|>=?|===|!==)(.*)$/

const stringReg = /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
const numberReg = /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
const nullReg = /null/
const trueReg = /true/
const falseReg = /false/

export const isExpression = (str: string) => {
  return expressionReg.test(str)
}
export const isTernary = (str: string) => {
  return ternaryReg.test(str)
}
export const isRelational = (str: string) => {
  return relationalReg.test(str)
}

export const parseExpression = () => {}

export const checkType = (str: string): [type: string, value: string | number | null | boolean] => {
  if (stringReg.test(str)) {
    return ['string', str.substr(1, str.length - 2)]
  }
  if (numberReg.test(str)) {
    return ['number', Number(str)]
  }
  if (nullReg.test(str)) {
    return ['null', null]
  }
  if (trueReg.test(str)) {
    return ['boolean', true]
  }
  if (falseReg.test(str)) {
    return ['boolean', false]
  }
  return ['field', str]
}

export const checkField = (type: string) => {
  if (type === 'field') {
    return true
  }
  return false
}

export const calculation = (formData: any, left: string, operator: string, right: string) => {
  let [lType, lVal]: any = checkType(left)
  let [rType, rVal]: any = checkType(right)

  if (checkField(lType)) {
    lVal = formData[lVal]
  }
  if (checkField(rType)) {
    rVal = formData[rVal]
  }
  if (operator === '===') {
    return lVal === rVal
  }

  if (operator === '!==') {
    return lVal !== rVal
  }
  if (operator === '>') {
    return (lVal as any) > (rVal as any)
  }

  if (operator === '>=') {
    return (lVal as any) >= (rVal as any)
  }

  if (operator === '<') {
    return (lVal as any) < (rVal as any)
  }

  if (operator === '<=') {
    return (lVal as any) <= (rVal as any)
  }

  return undefined
}

export const computeEveryResult = (formData: any = {}, rules: any) => {
  return rules.every((rule: any) => calculation(formData, rule.field, rule.method, rule.value))
}

export const computeSomeResult = (formData: any = {}, rules: any) => {
  return rules.some((rule: any) => calculation(formData, rule.field, rule.method, rule.value))
}

export const computeOptions = (formData: any = {}, rootOptions: any) => {
  return rootOptions.find((opt: any) => computeEveryResult(formData, opt.rules))?.options ?? []
}
export const computeResult = (formData: any = {}, rootOptions: any) => {
  return rootOptions.find((opt: any) => computeEveryResult(formData, opt.rules))?.result ?? undefined
}

export const computeValidateRules = (field: any = {}) => {
  const { rules = [], label } = field
  // TODO: 临时处理,目前只支持一层
  if (field.type === 'array') {
    // console.log(field)
    /*
val.rules
       
*/
    rules.push(
      ...Object.entries(field.item ?? {})
        .filter(([key, val]: any) => {
          return val.rules?.length > 0
        })
        .map(([key, val]: any) => {
          return {
            validator: async (rule: any, dataList: any) => {
              dataList.forEach((data: any) => {
                for (let rule of val.rules) {
                  if (rule.required) {
                    if (data[key] ?? true) {
                      throw new Error(`字段 ${val.label} 为空!`)
                    }
                  }
                }
              })
            }
          }
        })
    )
  }
  // console.log(rules)
  return rules.map((rule: any) => {
    const next = { ...rule }
    if (next.required && !next.message) {
      next.message = `${(requiredDefaultMsgMap as any)[field.widget] ?? ''}`.replace('${label}', label)
    }
    return next
  })
}

export const getLabelProps = (...list: (LabelLayout | undefined)[]) => {
  const labelLayout: LabelLayout = Object.assign({}, ...list)
  return {
    labelCol: { flex: labelLayout.width ?? '' },
    labelAlign: labelLayout.align
  }
}

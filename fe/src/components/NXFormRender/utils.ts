import { requiredDefaultMsgMap } from './widget'
import { get, set, cloneDeep, merge } from 'lodash-es'
import { defaultValidateMessagesCN } from './validateMessageCN'
import Validator from 'async-validator'
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
const isExpressionRuleObject = (rule: any) => {
  if (typeof rule !== 'object' || rule === null) {
    return false
  }

  const keys = ['mode', 'filter', 'result']
  return keys.every((k) => rule.hasOwnProperty(k))
}
export const isExpressionRule = (rule: any) => {
  if (rule instanceof Array) {
    if (rule.length === 0) {
      return false
    }
    if (typeof rule[0] !== 'object') {
      return false
    }
    return isExpressionRuleObject(rule[0])
  }

  return isExpressionRuleObject(rule)
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
function stringContains(str: string, text: any) {
  return str.indexOf(text) > -1
}
export const isObject = (a: any) => stringContains(Object.prototype.toString.call(a), 'Object')

export const clone = cloneDeep

export function getParentPath(path: string) {
  if (typeof path === 'string') {
    const pathArr = path.split('.')
    if (pathArr.length === 1) {
      return '#'
    }
    pathArr.pop()
    return pathArr.join('.')
  }
  return '#'
}
export function getValueByPath(formData: any, path: string) {
  if (path === '#' || !path) {
    return formData || {}
  } else if (typeof path === 'string') {
    return get(formData, path)
  } else {
    console.error('path has to be a string')
  }
}

export function parseSingleExpression(func: any, formData = {}, dataPath: string) {
  const parentPath = getParentPath(dataPath)
  const parent = getValueByPath(formData, parentPath) || {}
  if (typeof func === 'string') {
    const funcBody = func.substring(2, func.length - 2)
    const str = `
    return ${funcBody.replace(/formData/g, JSON.stringify(formData)).replace(/rootValue/g, JSON.stringify(parent))}`

    try {
      return Function(str)()
    } catch (error) {
      return null // 如果计算有错误，return null 最合适
    }
  } else return func
}

export const parseAllExpression = (_schema: any, formData: any, dataPath: any) => {
  const schema = clone(_schema)
  Object.keys(schema).forEach((key) => {
    const value = schema[key]
    if (isExpressionRule(value)) {
      console.log(value, formData, dataPath)
      // schema[key]  =
      // schema[key] = parseSingleExpression(value, formData, dataPath)
    } else if (isObject(value)) {
      // TODO: dataPath 这边要处理一下，否则rootValue类的没有效果
      schema[key] = parseAllExpression(value, formData, dataPath)
    } else if (isExpression(value)) {
      schema[key] = parseSingleExpression(value, formData, dataPath)
    } else if (typeof key === 'string' && key.toLowerCase().indexOf('props') > -1) {
      // 有可能叫 xxxProps
      const propsObj = schema[key]
      if (isObject(propsObj)) {
        Object.keys(propsObj).forEach((k) => {
          schema[key][k] = parseSingleExpression(propsObj[k], formData, dataPath)
        })
      }
    }
  })
  return schema
}

export function isObjType(schema: any) {
  return schema && schema.type === 'object' && schema.properties && !schema.widget
}
export function isListType(schema: any) {
  return schema && schema.type === 'array'
}

export function flattenSchema(_schema: any = {}, name: any = '#', parent: any = null, result: any = {}) {
  const schema = clone(_schema)
  let _name = name
  if (!schema.$id) {
    schema.$id = _name // path as $id, for easy access to path in schema
  }
  const children: any[] = []
  if (isObjType(schema)) {
    schema.properties.forEach(({ key, ...value }: any) => {
      const unKey = result[key] ? `${key}${Math.random().toString(36).substr(2, 6)}` : key
      const _key = isListType(value) ? unKey + '[]' : unKey
      const uniqueName = _name === '#' ? _key : _name + '.' + _key
      children.push(uniqueName)
      flattenSchema(value, uniqueName, _name, result)
    })
    schema.properties = []
  }
  if (isListType(schema)) {
    schema.items.properties?.forEach(({ key, ...value }: any) => {
      const unKey = result[key] ? `${key}${Math.random().toString(36).substr(2, 6)}` : key
      const _key = isListType(value) ? unKey + '[]' : key
      const uniqueName = _name === '#' ? _key : _name + '.' + _key

      children.push(uniqueName)
      flattenSchema(value, uniqueName, _name, result)
    })
    schema.items.properties = []
  }
  result[_name] = { parent, schema, children }
  // if (schema.type) {
  //   // TODO: 没有想好 validation 的部分
  //   result[_name] = { parent, schema, children }
  // }
  return result
}
export const schemaContainsExpression = (schema: any): any => {
  if (isObject(schema)) {
    return Object.keys(schema).some((key) => {
      const value = schema[key]
      if (typeof value === 'string') {
        return isExpression(value)
      } else if (isExpressionRule(value)) {
        return true
      } else if (isObject(value)) {
        return schemaContainsExpression(value)
      } else {
        return false
      }
    })
  }
  return false
}
export function getWidgetName(schema: any) {
  const { type, widget } = schema
  if (type === 'object') {
    return 'object'
  }
  if (type === 'array') {
    return 'array'
  }
  return widget
}

export function getDataPath(id: string, dataIndex: any) {
  if (id === '#') {
    return id
  }
  if (typeof id !== 'string') {
    throw Error(`id ${id} is not a string!!! Something wrong here`)
  }
  let _id = id
  if (Array.isArray(dataIndex)) {
    // const matches = id.match(/\[\]/g) || [];
    // const count = matches.length;
    dataIndex.forEach((item) => {
      _id = _id.replace(/\[\]/, `[${item}]`)
    })
  }
  return removeBrackets(_id)
}

function removeBrackets(string: string) {
  if (typeof string === 'string') {
    return string.replace(/\[\]/g, '')
  } else {
    return string
  }
}

export const translateMessage = (msg: string, schema: any) => {
  if (typeof msg !== 'string') {
    return ''
  }
  if (!schema) return msg
  msg = msg.replace('${label}', schema.label)
  msg = msg.replace('${type}', schema.format || schema.type)
  // 兼容代码
  if (typeof schema.min === 'number') {
    msg = msg.replace('${min}', schema.min)
  }
  if (typeof schema.max === 'number') {
    msg = msg.replace('${max}', schema.max)
  }
  if (schema.rules) {
    const minRule = schema.rules.find((r: any) => r.min !== undefined)
    if (minRule) {
      msg = msg.replace('${min}', minRule.min)
    }
    const maxRule = schema.rules.find((r: any) => r.max !== undefined)
    if (maxRule) {
      msg = msg.replace('${max}', maxRule.max)
    }
    const lenRule = schema.rules.find((r: any) => r.len !== undefined)
    if (lenRule) {
      msg = msg.replace('${len}', lenRule.len)
    }
    const patternRule = schema.rules.find((r: any) => r.pattern !== undefined)
    if (patternRule) {
      msg = msg.replace('${pattern}', patternRule.pattern)
    }
  }
  return msg
}

export const getKeyFromPath = (path = '#') => {
  try {
    const arr = path.split('.')
    const last = arr.slice(-1)[0]
    const result = last.replace('[]', '')
    return result
  } catch (error) {
    console.error(error, 'getKeyFromPath')
    return ''
  }
}

export function getSchemaFromFlatten(flatten: any, path = '#') {
  let schema: any = {}
  const item: any = clone(flatten[path])
  if (item) {
    schema = item.schema
    // remove $id, maybe leave it for now
    // schema.$id && delete schema.$id;
    if (item.children.length > 0) {
      item.children.forEach((child: any) => {
        if (!flatten[child]) return
        const key = getKeyFromPath(child)
        if (isObjType(schema)) {
          schema.properties[key] = getSchemaFromFlatten(flatten, child)
        }
        if (isListType(schema)) {
          schema.items.properties[key] = getSchemaFromFlatten(flatten, child)
        }
      })
    }
  }
  return schema
}

export const getDescriptorFromSchema = ({ schema }: any) => {
  let result: any = {}
  let singleResult: any = {
    type: 'any'
  }
  if (schema.hidden === true) return { validator: () => true }
  if (isObjType(schema)) {
    result.type = 'object'
    if (schema.required === true) {
      result.required = true
    }
    result.fields = {}
    Object.keys(schema.properties).forEach((key) => {
      const item = schema.properties[key]
      // 兼容旧的！
      if (Array.isArray(schema.required) && schema.required.indexOf(key) > -1) {
        item.required = true
      }
      result.fields[key] = getDescriptorFromSchema({
        schema: item
      })
    })
  } else if (isListType(schema)) {
    result.type = 'array'
    if (schema.required === true) {
      result.required = true
    }
    if (typeof schema.min === 'number') {
      result.min = schema.min
    }
    if (typeof schema.max === 'number') {
      result.max = schema.max
    }
    result.defaultField = { type: 'object', fields: {} } // 目前就默认只有object类型的 TODO:
    Object.keys(schema.items.properties).forEach((key) => {
      const item = schema.items.properties[key]
      // 兼容旧的！
      if (Array.isArray(schema.required) && schema.required.indexOf(key) > -1) {
        item.required = true
      }
      result.defaultField.fields[key] = getDescriptorFromSchema({
        schema: item
      })
    })
  } else {
    // 单个的逻辑
    const processRule = (item: any) => {
      if (schema.type) return { ...item, type: schema.type }
      if (item.pattern && typeof item.pattern === 'string') {
        return { ...item, pattern: new RegExp(item.pattern) }
      }
      return item
    }
    const { required, ...rest } = schema

    ;['type', 'pattern', 'min', 'max', 'len'].forEach((key) => {
      if (Object.keys(rest).indexOf(key) > -1) {
        singleResult[key] = rest[key]
      }
    })

    let requiredRule
    if (schema.required === true) {
      requiredRule = { required: true, type: singleResult.type || 'string' }
    }

    if (schema.rules) {
      if (Array.isArray(schema.rules)) {
        const _rules: any[] = []
        schema.rules.forEach((item: any) => {
          if (item.required === true) {
            requiredRule = item
          } else {
            _rules.push(processRule(item))
          }
        })
        result = [singleResult, ..._rules]
      } else if (isObject(schema.rules)) {
        // TODO: 规范上不允许rules是object，省一点事儿
        result = [singleResult, processRule(schema.rules)]
      } else {
        result = singleResult
      }
    } else {
      result = singleResult
    }

    if (requiredRule) {
      if (Array.isArray(result)) {
        result.push(requiredRule)
      } else if (isObject(result)) {
        result = [result, requiredRule]
      }
    }
  }
  if (result.length > 1) {
    let typeIndex, requiredIndex
    for (let i = 0; i < result.length; i++) {
      if (result[i].hasOwnProperty('type')) {
        typeIndex = i
      } else if (result[i].required) {
        requiredIndex = i
      }
    }
    if (typeIndex !== undefined && requiredIndex !== undefined) {
      Object.assign(result[requiredIndex], result[typeIndex])
      result.splice(typeIndex, 1)
    }
  }
  return result
}

export const validateAll = ({ formData, flatten, validateMessages = {} }: any) => {
  let _schema = getSchemaFromFlatten(flatten)
  if (Object.keys(_schema).length === 0) return Promise.resolve()
  const descriptor = getDescriptorFromSchema({
    schema: _schema
  }).fields

  let touchVerifyList: any = []

  // 如果是最后的校验，所有key都touch了，就不用算这个了
  // 因为要整个构建validator在list的情况太复杂了，所以required单独拿出来处理，但是这边有不少单独处理逻辑，例如message
  // if (!isRequired) {
  //   touchedKeys.forEach((key) => {
  //     const keyRequired = isPathRequired(key, _schema)
  //     const val = get(formData, key)
  //     const nullValue = [undefined, null, ''].indexOf(val) > -1 // 注意 0 不是
  //     const isEmptyMultiSelect = Array.isArray(val) && val.length === 0
  //     if ((nullValue || isEmptyMultiSelect) && keyRequired.required) {
  //       const _message = keyRequired.message || validateMessages.required || '${label}必填'
  //       touchVerifyList.push({ name: key, error: [_message] })
  //     }
  //   })
  // }

  const cn = defaultValidateMessagesCN

  // TODO: 有些情况会出现没有rules，需要看一下，先兜底
  let validator
  try {
    validator = new Validator(descriptor)
  } catch (error) {
    return Promise.resolve([])
  }
  let messageFeed = cn
  merge(messageFeed, validateMessages)
  validator.messages(messageFeed)
  return validator
    .validate(formData || {})
    .then((res) => {
      if (touchVerifyList.length > 0) return touchVerifyList
      return []
    })
    .catch(({ errors, fields }) => {
      // error的name改成正常的path
      let normalizedErrors = getArray(errors).map((err) => {
        const _path = formatPathFromValidator(err.field)
        return { name: _path, error: [err.message] }
      })
      // 添加touched的required
      normalizedErrors = [...normalizedErrors, ...touchVerifyList]
      // 合并同名的error
      let _errorFields: any[] = []
      normalizedErrors.forEach((item) => {
        const matchIndex = _errorFields.findIndex((ele) => ele.name === item.name)
        if (matchIndex === -1) {
          _errorFields.push(item)
        } else {
          _errorFields[matchIndex].error = [..._errorFields[matchIndex].error, ...item.error]
        }
      })
      return _errorFields
    })
}
export const getArray = (arr: any, defaultValue = []) => {
  if (Array.isArray(arr)) return arr
  return defaultValue
}
export const formatPathFromValidator = (err: any) => {
  const errArr = err.split('.')
  return errArr
    .map((item: any) => {
      if (isNaN(Number(item))) {
        return item
      } else {
        return `[${item}]`
      }
    })
    .reduce((a: any, b: any) => {
      if (b[0] === '[' || a === '') {
        return a + b
      } else {
        return a + '.' + b
      }
    }, '')
}

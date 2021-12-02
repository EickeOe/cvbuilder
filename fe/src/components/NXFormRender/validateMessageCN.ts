const typeTemplate = '${label}的类型不是${type}'

export const defaultValidateMessagesCN = {
  default: '${label}未通过校验',
  required: '${label}必填',
  whitespace: '${label}不能为空',
  date: {
    format: '${label}的格式错误',
    parse: '${label}无法被解析',
    invalid: '${label}数据不合法'
  },
  types: {
    string: typeTemplate,
    method: typeTemplate,
    array: typeTemplate,
    object: typeTemplate,
    number: typeTemplate,
    date: typeTemplate,
    boolean: typeTemplate,
    integer: typeTemplate,
    float: typeTemplate,
    regexp: typeTemplate,
    email: typeTemplate,
    url: typeTemplate,
    hex: typeTemplate
  },
  string: {
    len: '${label}长度不是${len}',
    min: '${label}长度不能小于${min}',
    max: '${label}长度不能大于${max}',
    range: '${label}长度需在${min}于${max}之间'
  },
  number: {
    len: '${label}不等于${len}',
    min: '${label}不能小于${min}',
    max: '${label}不能大于${max}',
    range: '${label}需在${min}与${max}之间'
  },
  array: {
    len: '${label}长度不是${len}',
    min: '${label}长度不能小于${min}',
    max: '${label}长度不能大于${max}',
    range: '${label}长度需在${min}于${max}之间'
  },
  pattern: {
    mismatch: '${label}未通过正则判断${pattern}'
  }
}

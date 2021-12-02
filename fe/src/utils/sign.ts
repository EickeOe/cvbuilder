import md5 from 'md5'

const safityGetterValue = (val: any = '') => {
  if (val === undefined || val === null || val === '') {
    return ''
  }
  if (Object.prototype.toString.call(val) === '[object Object]') {
    return JSON.stringify(val)
  }
  if (Object.prototype.toString.call(val) === '[object Array]') {
    if (val.length > 0 && typeof val[0] === 'object') {
      let formatterString = ''
      val.forEach((v: any, i: any) => {
        if (i === val.length - 1) {
          formatterString += JSON.stringify(v)
        } else {
          formatterString += JSON.stringify(v) + ','
        }
      })
      return formatterString
    } else {
      return val.toString()
    }
  }
  return val.toString()
}
/**
  生成newSign字符串
  */
export default function sign(paramObj: any) {
  // console.log('paramObj,', paramObj)
  const salt = '048a9c4943398714b356a696503d2d36'
  const paramsToken = Object.keys(paramObj)
    .sort()
    .reduce((sign, key) => `${sign}${key}${safityGetterValue(paramObj[key])}`, '')
  return md5(`${paramsToken}${salt}`)
}

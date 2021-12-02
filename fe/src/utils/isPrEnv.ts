// 此函数用于判断当前cloud域名是否为预发环境或者为生产环境
export default function isPrEnv() {
  const reg = /^(pre-?)cloud/
  return reg.test(location.host)
}

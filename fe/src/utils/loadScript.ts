/**
 * 异步加载js
 * @param url
 */
export default function loadScript(url: string) {
  return new Promise<void>((resolve, reject) => {
    const script: any = document.createElement('script')
    script.type = 'text/javascript'

    // IE.
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          resolve()
        } else {
          reject(new Error(`脚本加载失败，URL：${url}`))
        }
        script.onreadystatechange = null
      }

      // Others.
    } else {
      script.addEventListener('load', onLoad)
      script.addEventListener('error', onError)
    }

    script.src = url
    document.head && document.getElementsByTagName('head')[0].appendChild(script)

    /**
     * load 之后的事件
     */
    function onLoad() {
      resolve()
      removeListener()
    }

    /**
     * 报错之后的事件
     */
    function onError(err: any) {
      reject(err || new Error(`脚本加载失败，URL：${url}`))
      removeListener()
    }

    /**
     * 移除添加的事件
     */
    function removeListener() {
      script.removeEventListener('load', onLoad)
      script.removeEventListener('error', onError)
    }
  })
}

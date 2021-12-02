export const isBrowser = typeof window !== 'undefined'
// history补丁，发送事件
const patchHistoryMethod = (method: string) => {
  const history: any = window.history
  const original = history[method]

  history[method] = function (state: any) {
    const result = original.apply(this, arguments)
    const event = new Event(method.toLowerCase())

    ;(event as any).state = state

    window.dispatchEvent(event)
    window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
    return result
  }
}

patchHistoryMethod('pushState')
patchHistoryMethod('replaceState')

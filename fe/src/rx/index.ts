import { BehaviorSubject, scan, shareReplay } from 'rxjs'

export const baseAppSubject = new BehaviorSubject<{
  [key: string]: any
}>({
  apiEnv: 'prod'
})

export const baseAppObservable = baseAppSubject.pipe(
  scan((prev, next) => {
    return { ...prev, ...next }
  }),
  shareReplay(1)
)
baseAppObservable.subscribe()

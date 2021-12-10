import { updateAppVisitRecordApi } from '@/apis/app'
import { useEffect } from 'react'
import useCurrentApp from './useCurrentApp'

export default function useUpdateAppVisitRecord() {
  const currentApp = useCurrentApp()
  useEffect(() => {
    if (currentApp.key) {
      updateAppVisitRecordApi(currentApp.key)
    }
  }, [currentApp.key])
}

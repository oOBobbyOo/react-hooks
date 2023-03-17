import { useEffect, useState } from 'react'
import useThrottleFn from './useThrottleFn'

export interface ThrottleOptions {
  wait?: number // 需要节流的毫秒数
  leading?: boolean // 指定调用在节流开始前, 默认false
  trailing?: boolean // 指定调用在节流结束后, 默认true
}

function useThrottle<T>(value: T, options?: ThrottleOptions) {
  const [throttled, setThrottled] = useState(value)

  const { run } = useThrottleFn(() => {
    setThrottled(value)
  }, options)

  useEffect(() => {
    run()
  }, [value])

  return throttled
}

export default useThrottle

import { useEffect, useState } from 'react'
import useDebounceFn from './useDebounceFn'

export interface DebounceOptions {
  wait?: number // 需要延迟的毫秒数
  leading?: boolean // 指定在延迟开始前调用, 默认false
  trailing?: boolean // 指定在延迟结束后调用，默认true
  maxWait?: number // 设置 func 允许被延迟的最大值
}

function useDebounce<T>(value: T, options?: DebounceOptions) {
  const [debounced, setDebounced] = useState(value)

  const { run } = useDebounceFn(() => {
    setDebounced(value)
  }, options)

  useEffect(() => {
    run()
  }, [value])

  return debounced
}

export default useDebounce

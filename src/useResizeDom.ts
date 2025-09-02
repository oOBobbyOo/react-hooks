import { useEffect, useState } from 'react'
import type { BasicTarget } from './shared'
import { getTargetElement } from './shared'

export interface Size {
  width: number
  height: number
}

function useResizeDom(target: BasicTarget, callback?: (size: Size, target: Element) => void): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 })

  useEffect(() => {
    const element = getTargetElement(target)
    if (!element) return

    // 检查 ResizeObserver 支持
    if (typeof ResizeObserver === 'undefined') {
      console.warn('ResizeObserver is not supported in this environment')
      return
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        const newSize = { width, height }

        setSize(newSize)

        // 如果提供了回调函数，则调用它
        if (callback) {
          callback(newSize, entry.target)
        }
      }
    })

    resizeObserver.observe(element)

    // 清理函数
    return () => {
      resizeObserver.disconnect()
    }
  }, [target, callback])

  return size
}

export default useResizeDom

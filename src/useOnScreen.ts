import { useState, useEffect, MutableRefObject } from 'react'

export default function useOnScreen<T extends Element>(
  ref: MutableRefObject<T>,
  rootMargin = '0px'
): boolean {
  // 状态是否可见
  const [isIntersecting, setIntersecting] = useState<boolean>(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // observer 回调触发跟新状态
        setIntersecting(entry.isIntersecting)
      },
      {
        rootMargin
      }
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref.current && observer.unobserve(ref.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return isIntersecting
}

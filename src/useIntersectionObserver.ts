import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

// github.com/thebuilder/react-intersection-observer

const useIntersectionObserver = <T extends Element>(
  ref: RefObject<T>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]: IntersectionObserverEntry[]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isIntersecting
}

export default useIntersectionObserver

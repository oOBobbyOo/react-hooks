import { RefObject, useEffect } from 'react'
import useRafState from './useRafState'
import { off, on } from './shared'

const useScroll = (ref: RefObject<HTMLElement>) => {
  const [position, setPosition] = useRafState({
    x: 0,
    y: 0
  })

  useEffect(() => {
    const handler = () => {
      if (ref.current) {
        setPosition({
          x: ref.current.scrollLeft,
          y: ref.current.scrollTop
        })
      }
    }

    if (ref.current) {
      on(ref.current, 'scroll', handler, {
        capture: false,
        passive: true
      })
    }

    return () => {
      if (ref.current) {
        off(ref.current, 'scroll', handler)
      }
    }
  }, [ref])

  return position
}

export default useScroll

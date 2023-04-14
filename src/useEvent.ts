import { useCallback, useLayoutEffect, useRef } from 'react'

type callbackType = (...args: any[]) => any

interface useEventOverload {
  <T extends callbackType>(handler: T): T
  <T extends callbackType>(handler: T): any
}

// github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md#internal-implementation

const useEvent: useEventOverload = (handler) => {
  const handlerRef = useRef(handler)

  useLayoutEffect(() => {
    handlerRef.current = handler
  })

  return useCallback((...args: any[]) => {
    const fn = handlerRef.current
    return fn(...args)
  }, [])
}

export default useEvent

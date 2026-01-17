import { useReducer, useCallback } from 'react'

function useForceUpdate() {
  const [, forceUpdate] = useReducer((x) => x + 1, 0)

  return useCallback(() => {
    forceUpdate()
  }, [])
}

export default useForceUpdate

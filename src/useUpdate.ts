import { useCallback, useState } from 'react'

// useUpdate 会返回一个函数，调用该函数会强制组件重新渲染
const useUpdate = () => {
  const [, setState] = useState({})

  return useCallback(() => setState({}), [])
}

export default useUpdate

// react-use
/* import { useReducer } from 'react'

const updateReducer = (num: number): number => (num + 1) % 1_000_000

export function useUpdate(): () => void {
  const [, update] = useReducer(updateReducer, 0)
  return update
}
*/

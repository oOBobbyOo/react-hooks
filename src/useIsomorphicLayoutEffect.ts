import { useEffect, useLayoutEffect } from 'react'
import { isBrowser } from './shared'

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect

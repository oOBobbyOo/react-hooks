type Callback<T extends unknown[]> = (...args: T) => void

interface ThrottledFunction<T extends unknown[]> {
  (...args: T): void
  cancel: () => void
}

export const rafThrottle = <T extends unknown[]>(callback: Callback<T>): ThrottledFunction<T> => {
  let rafId: number | null = null
  let lastArgs: T | null = null

  const throttled = (...args: T): void => {
    lastArgs = args

    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        callback(...(lastArgs as T))
        rafId = null
        lastArgs = null
      })
    }
  }

  throttled.cancel = (): void => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
      lastArgs = null
    }
  }

  return throttled as ThrottledFunction<T>
}

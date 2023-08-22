import { useCallback, useEffect } from 'react'
import { debounce } from 'lodash-es'

const useRem = (designWidth = 750) => {
  const setRemFontBaseSize = useCallback(() => {
    const clientWidth = document.documentElement.clientWidth || document.body.clientWidth
    const rem = (clientWidth / designWidth) * 100
    document.documentElement.style.fontSize = rem + 'px'
  }, [designWidth])

  useEffect(() => {
    setRemFontBaseSize()

    const debouncedFontSize = debounce(() => {
      setRemFontBaseSize()
    }, 100)

    window.addEventListener('resize', debouncedFontSize, false)

    return () => {
      window.removeEventListener('resize', debouncedFontSize, false)
    }
  }, [])
}

export default useRem

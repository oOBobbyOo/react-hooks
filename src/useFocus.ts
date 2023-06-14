import { LegacyRef, useRef, useState, useEffect } from 'react'

function useFocus<T extends HTMLInputElement>(): [LegacyRef<T | undefined>, boolean] {
  const ref = useRef<T>()
  const [focussed, setFocussed] = useState<boolean>(false)

  useEffect(() => {
    if (!ref.current) return
    const currentElement = ref.current
    const onFocus = () => setFocussed(true)
    const onBlur = () => setFocussed(false)

    currentElement.addEventListener('focus', onFocus)
    currentElement.addEventListener('blur', onBlur)

    return () => {
      currentElement.removeEventListener('focus', onFocus)
      currentElement.removeEventListener('blur', onBlur)
    }
  }, [])

  return [ref, focussed]
}

export default useFocus

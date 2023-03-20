import { useEffect, useRef } from 'react'

function useTitle(title: string) {
  const prevTitleRef = useRef(document.title)
  useEffect(() => {
    document.title = title
    return () => {
      document.title = prevTitleRef.current
    }
  }, [title])
}

export default useTitle

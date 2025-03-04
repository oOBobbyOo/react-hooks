import { useEffect } from 'react'

function useFavicon(url: string) {
  useEffect(() => {
    let link: HTMLLinkElement | null = document.querySelector(`link[rel~="icon"]`)
    if (!link) {
      link = document.createElement('link')
      link.type = 'image/x-icon'
      link.rel = 'icon'
      link.href = url
      document.head.appendChild(link)
    } else {
      link.href = url
    }
  }, [url])
}

export default useFavicon

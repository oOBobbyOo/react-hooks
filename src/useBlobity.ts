import { useEffect, useRef } from 'react'

import Blobity from 'blobity'
import type { Options } from 'blobity/lib/Blobity'
import useWindowScroll from './useWindowScroll'

const defaultOptions: Partial<Options> = {
  licenseKey: 'opensource',
  invert: true,
  zIndex: 0,
  magnetic: false,
  dotColor: '#10b981',
  radius: 8,
  focusableElementsOffsetX: 5,
  focusableElementsOffsetY: 4,
  mode: 'normal',
  focusableElements:
    '[data-blobity], a:not([data-no-blobity]), button:not([data-no-blobity]), [data-blobity-tooltip]'
}

function useBlobity(options: Partial<Options> = defaultOptions) {
  const blobity = useRef<Blobity | null>(null)

  const { y } = useWindowScroll()

  useEffect(() => {
    if (!blobity.current) {
      blobity.current = new Blobity(options)
    }

    return () => {
      blobity.current?.destroy()
    }
  }, [])

  useEffect(() => {
    blobity.current?.bounce()
  }, [y])

  function reset() {
    blobity.current?.reset()
    blobity.current?.updateOptions(defaultOptions)
  }

  return {
    blobity,
    reset
  }
}

export default useBlobity

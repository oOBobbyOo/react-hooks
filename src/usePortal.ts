import type { ReactNode, ReactPortal } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { createPortal, unmountComponentAtNode } from 'react-dom'

type IChildrenProps = {
  children: ReactNode
}

type IProtalProps = {
  render: ({ children }: IChildrenProps) => ReactPortal | null
  remove: () => boolean | null
}

const usePortal = (el: Element = document.body) => {
  const [portal, setPortal] = useState<IProtalProps>({
    render: () => null,
    remove: () => null
  })

  const createPortals = useCallback((el: Element) => {
    const Portal = ({ children }: IChildrenProps) => createPortal(children, el)
    const remove = () => unmountComponentAtNode(el)
    return { render: Portal, remove }
  }, [])

  useEffect(() => {
    if (el) portal.remove()
    const newPortal = createPortals(el)
    setPortal(newPortal)
    return () => {
      newPortal.remove()
    }
  }, [el])

  return portal.render
}

export default usePortal

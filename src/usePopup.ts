import { useState } from 'react'

export type UsePopupHandler = {
  openPopup: () => void
  closePopup: () => void
}

type UsePopup = [boolean, UsePopupHandler]

function usePopup(initVisible?: boolean): UsePopup {
  const [visible, setVisible] = useState<boolean>(initVisible || false)
  function switchVisible(visible: boolean) {
    return () => setVisible(visible)
  }
  return [
    visible,
    {
      openPopup: switchVisible(true),
      closePopup: switchVisible(false)
    }
  ]
}

export default usePopup

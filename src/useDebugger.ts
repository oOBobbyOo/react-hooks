import { useEffect } from 'react'

const useDebugger = (wait = 50) => {
  useEffect(() => {
    function doCheck() {
      setInterval(() => {
        ;(function () {
          return !1
        }
          ['constructor']('debugger')
          ['call']())
      }, wait)
    }

    try {
      doCheck()
    } catch (err) {
      console.log(err)
    }
  }, [])

  return []
}

export default useDebugger

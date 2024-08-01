import type { NavigateOptions, To } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function useRouteTo() {
  const navigate = useNavigate()

  const routeTo = (path: To, options?: NavigateOptions) => {
    navigate(path, options)
  }

  const refreshPage = () => {
    navigate(0)
  }

  return {
    routeTo,
    refreshPage
  }
}

export default useRouteTo

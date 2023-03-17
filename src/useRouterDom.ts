import { useLocation, useParams, useMatches, useNavigation, useNavigate } from 'react-router-dom'

// https://reactrouter.com/en/main

function useRouterDom() {
  const location = useLocation()
  const params = useParams()
  const matches = useMatches()
  const navigation = useNavigation()

  const navigate = useNavigate()
  const back = () => navigate(-1)
  const forward = () => navigate(1)

  return [location, params, matches, navigation, navigate, back, forward]
}

export default useRouterDom

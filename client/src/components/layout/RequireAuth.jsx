import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'

export default function RequireAuth() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  // Czekamy na /auth/me, bo inaczej po odświeżeniu zalogowany trafiłby na chwilę na /login.
  if (isLoading) return null
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

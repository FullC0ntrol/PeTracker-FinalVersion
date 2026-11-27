import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth.js'
import Spinner from '../ui/Spinner.jsx'

export default function RequireAuth() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  // Czekamy na /auth/me, bo inaczej po odświeżeniu zalogowany trafiłby na chwilę na /login.
  if (isLoading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Spinner label="Sprawdzam sesję..." />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

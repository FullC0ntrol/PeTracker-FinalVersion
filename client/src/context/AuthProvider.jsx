import { useEffect, useMemo, useState } from 'react';
import {
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from '../api/auth.js';
import { AuthContext } from '../context/AuthContext.js';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false 
    getCurrentUser().then((currentUser) => {
      if (!ignore) setUser(currentUser)
    })
  // Brak połączenia traktujemy jako brak sessji
  .catch(() => {})
  .finally(() => {
    if (!ignore) setIsLoading(false)
  })
  return () => { ignore = true }}, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      async login(email, pin) {
        const result = await apiLogin(email, pin)
        setUser(result.user)
      },
      async register(account) {
        const result = await apiRegister(account)
        setUser(result.user)
      },
      async logout() {
        await apiLogout()
        setUser(null)
      },
    }),
    [user, isLoading],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
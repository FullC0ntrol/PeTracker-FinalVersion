import jwt from 'jsonwebtoken'
import { config } from '../config.js'

// Sesja to podpisany token JWT z id użytkownika, więc serwer nie musi trzymać listy sesji.
export const SESSION_COOKIE = 'petrace_session'
const SESSION_DAYS = 30

const cookieOptions = {
  // Skrypt na stronie nie odczyta ciasteczka, więc nie ukradnie go przez XSS.
  httpOnly: true,
  secure: config.cookieSecure,
  // Przeglądarka nie dołączy ciasteczka do POST-a wysłanego z obcej strony.
  sameSite: 'lax',
  path: '/',
}

export function setSessionCookie(res, userId) {
  const token = jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: `${SESSION_DAYS}d` })
  res.cookie(SESSION_COOKIE, token, {
    ...cookieOptions,
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  })
}

// Przeglądarka usunie ciasteczko tylko wtedy, gdy opcje są takie same jak przy ustawianiu.
export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, cookieOptions)
}

// Brak ciasteczka, zły podpis i wygasły token dają null.
export function readSessionUserId(req) {
  const token = req.cookies?.[SESSION_COOKIE]
  if (!token) return null
  try {
    return jwt.verify(token, config.jwtSecret).sub
  } catch {
    return null
  }
}

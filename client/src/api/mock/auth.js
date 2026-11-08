import { getDb, saveDb } from '../../mocks/db.js'
import { safeRedirect } from '../../lib/redirect.js'
import { apiError } from '../errors.js'
import { delay } from './client.js'

/*
  Logowanie bez hasła („magic link”) — odpowiednik przyszłego server/src/routes/auth.js:
    1. requestMagicLink — „serwer” zapisuje jednorazowy token i „wysyła” e-mail z linkiem
       /auth/verify?token=…  (e-maila nie ma, link wraca jako `devLink`)
    2. verifyToken — sprawdza token i zakłada sesję (sesja 17)
*/

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LINK_TTL_MS = 15 * 60 * 1000

export async function requestMagicLink(email, { name = '', next = null } = {}) {
  await delay()
  const normalizedEmail = email.trim().toLowerCase()
  if (!EMAIL_PATTERN.test(normalizedEmail)) throw apiError(400, 'Wpisz poprawny adres e-mail.')

  const db = getDb()
  // Konta jeszcze nie zakładamy: token pamięta e-mail i imię, a konto powstanie
  // w verifyToken — dopiero gdy ktoś kliknie link ze swojej skrzynki.
  const token = crypto.randomUUID()
  db.loginTokens.push({
    token,
    email: normalizedEmail,
    name: name.trim(),
    expiresAt: new Date(Date.now() + LINK_TTL_MS).toISOString(),
    usedAt: null,
  })
  saveDb(db)

  const params = new URLSearchParams({ token })
  const safeNext = safeRedirect(next)
  if (safeNext) params.set('next', safeNext)

  // Prawdziwy serwer w produkcji NIGDY nie zwraca linku — wysyła go e-mailem.
  // `devLink` istnieje tylko po to, żeby przycisk „[DEV] Symuluj kliknięcie w link” miał dokąd prowadzić.
  return { email: normalizedEmail, devLink: `/auth/verify?${params}` }
}
import { getDb, saveDb } from '../../mocks/db.js'
import { safeRedirect } from '../../lib/redirect.js'
import { apiError } from '../errors.js'
import { delay} from './client.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// const PHONE_PATTERN = /^\+?[0-9 ()-]{9,20}$/
const LINK_TTL_MS = 15 * 60 * 1000

export async function requestMagicLink(email, { name = '', next = null } = {}) {
  await delay()
  const normalizedEmail = email.trim().toLowerCase()
  if (!EMAIL_PATTERN.test(normalizedEmail)) throw apiError(400, 'Wpisz poprawny adres e-mail.')

  const db = getDb()
  // Magic link służy też do rejestracji: nieznany e-mail zakłada konto.
  let user = db.users.find((item) => item.email === normalizedEmail)
  if (!user) {
    user = { id: crypto.randomUUID(), email: normalizedEmail, name: name.trim() || normalizedEmail.split('@')[0], phone: '' }
    db.users.push(user)
  }

  const token = crypto.randomUUID()
  db.loginTokens.push({ token, userId: user.id, expiresAt: new Date(Date.now() + LINK_TTL_MS).toISOString(), usedAt: null })
  saveDb(db)

  const params = new URLSearchParams({ token })
  const safeNext = safeRedirect(next)
  if (safeNext) params.set('next', safeNext)

  // Prawdziwy serwer w produkcji NIGDY nie zwraca linku — wysyła go e-mailem.
  // `devLink` istnieje tylko po to, żeby przycisk „[DEV] Symuluj kliknięcie w link” miał dokąd prowadzić.
  return { email: normalizedEmail, devLink: `/auth/verify?${params}` }
}
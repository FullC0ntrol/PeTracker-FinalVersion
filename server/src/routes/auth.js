import { Router } from 'express'
import { query } from '../db.js'
import { HttpError } from '../errors.js'
import { toUser } from '../mappers.js'
import { rateLimit } from '../middleware/rateLimit.js'
import { loadUser } from '../middleware/requireAuth.js'
import { hashPin, verifyPin } from '../services/pin.js'
import { clearSessionCookie, setSessionCookie } from '../services/session.js'
import { parseEmail, parseName, parsePin } from '../validation.js'

export const authRouter = Router()

const FIFTEEN_MINUTES = 15 * 60 * 1000
const TOO_MANY_LOGINS = 'Za dużo prób logowania. Spróbuj ponownie za kilkanaście minut.'

const limitRegisterByIp = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 10,
  keyFn: (req) => req.ip,
  message: 'Za dużo prób założenia konta. Spróbuj ponownie za kilkanaście minut.',
})
const limitLoginByIp = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 20,
  keyFn: (req) => req.ip,
  message: TOO_MANY_LOGINS,
})
// Bez trim i małych liter wystarczyłoby dopisać spację, żeby dostać nowe 5 prób.
function emailKey(req) {
  const email = String(req.body?.email ?? '')
  return email.trim().toLowerCase()
}

// Limit na e-mail chroni konto, nawet gdy ktoś zgaduje PIN z wielu adresów IP.
const limitLoginByEmail = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 5,
  keyFn: emailKey,
  message: TOO_MANY_LOGINS,
})

// Skrót do porównania, gdy konta nie ma, żeby takie logowanie trwało tyle samo co prawdziwe.
const DUMMY_PIN_HASH = await hashPin('000000')

// Express 5 zostawia req.body jako undefined, gdy żądanie nie ma treści.
authRouter.post('/register', limitRegisterByIp, async (req, res) => {
  const body = req.body ?? {}
  const email = parseEmail(body.email)
  const name = parseName(body.name)
  const pin = parsePin(body.pin)

  // Dzięki ON CONFLICT dwie równoczesne rejestracje tego samego adresu nie kończą się błędem bazy.
  const { rows } = await query(
    `INSERT INTO users (email, name, pin_hash) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, email, name, phone`,
    [email, name, await hashPin(pin)],
  )
  if (!rows[0]) throw new HttpError(409, 'Konto z tym adresem e-mail już istnieje. Zaloguj się.')

  setSessionCookie(res, rows[0].id)
  res.status(201).json({ user: toUser(rows[0]) })
})

authRouter.post('/login', limitLoginByIp, limitLoginByEmail, async (req, res) => {
  const body = req.body ?? {}
  const email = parseEmail(body.email)
  const pin = parsePin(body.pin)

  const { rows } = await query(
    'SELECT id, email, name, phone, pin_hash FROM users WHERE email = $1',
    [email],
  )
  const user = rows[0]
  const pinMatches = await verifyPin(pin, user?.pin_hash ?? DUMMY_PIN_HASH)
  // Ten sam komunikat dla złego e-maila i złego PIN-u, żeby nie zdradzać, które konta istnieją.
  if (!user || !pinMatches) throw new HttpError(401, 'Nieprawidłowy e-mail lub PIN.')

  setSessionCookie(res, user.id)
  res.json({ user: toUser(user) })
})

// Niezalogowany dostaje user: null zamiast 401, bo to zwykła sytuacja przy starcie aplikacji.
authRouter.get('/me', loadUser, (req, res) => {
  res.json({ user: req.user ? toUser(req.user) : null })
})

// Token zostaje ważny do końca terminu, wylogowanie tylko usuwa ciasteczko z przeglądarki.
authRouter.post('/logout', (req, res) => {
  clearSessionCookie(res)
  res.status(204).end()
})

import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

// scrypt jest celowo wolny, żeby zgadywanie PIN-ów po wycieku bazy trwało bardzo długo.
const scryptAsync = promisify(scrypt)
const KEY_LENGTH = 64

// Zapisujemy „sól:skrót”, a losowa sól sprawia, że ten sam PIN daje na każdym koncie inny skrót.
export async function hashPin(pin) {
  const salt = randomBytes(16).toString('hex')
  const key = await scryptAsync(pin, salt, KEY_LENGTH)
  return `${salt}:${key.toString('hex')}`
}

export async function verifyPin(pin, stored) {
  const [salt, expectedHex = ''] = stored.split(':')
  const expected = Buffer.from(expectedHex, 'hex')
  // timingSafeEqual rzuca błąd przy różnych długościach, więc uszkodzony skrót odrzucamy wcześniej.
  if (expected.length !== KEY_LENGTH) return false
  const key = await scryptAsync(pin, salt, KEY_LENGTH)
  // Porównanie trwa zawsze tyle samo, więc czas odpowiedzi nie zdradza, ile znaków się zgadza.
  return timingSafeEqual(key, expected)
}

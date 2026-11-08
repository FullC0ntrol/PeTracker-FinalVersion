import { HttpError } from './errors.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function text(value, maxLength, fieldLabel) {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') throw new HttpError(400, `Pole „${fieldLabel}” ma zły format.`)
  const trimmed = value.trim()
  if (trimmed.length > maxLength) {
    throw new HttpError(400, `Pole „${fieldLabel}” jest za długie (max ${maxLength} znaków).`)
  }
  return trimmed
}

export function parseEmail(value) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : ''
  if (!EMAIL_PATTERN.test(email) || email.length > 254) throw new HttpError(400, 'Wpisz poprawny adres e-mail.')
  return email
}

export function parseName(value) {
  const name = text(value, 60, 'Imię')
  if (!name) throw new HttpError(400, 'Podaj imię.')
  return name
}

export function parsePin(value) {
  if (typeof value !== 'string' || !/^\d{6}$/.test(value)) throw new HttpError(400, 'PIN musi mieć dokładnie 6 cyfr.')
  return value
}
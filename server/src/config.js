// Cała konfiguracja serwera w jednym miejscu. Reszta kodu czyta `config`, nigdy `process.env`.
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const isProduction = process.env.NODE_ENV === 'production'

// W dev brakująca zmienna dostaje wartość domyślną. W produkcji serwer nie wystartuje,
// żeby np. nie podpisywać sesji jawnym, domyślnym sekretem.
function required(name, fallbackForDev) {
  const value = process.env[name]
  if (value) return value
  if (!isProduction && fallbackForDev !== undefined) return fallbackForDev
  throw new Error(`Brak wymaganej zmiennej środowiskowej ${name}.`)
}

export const config = {
  isProduction,
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: required('DATABASE_URL', 'postgres://petrace:petrace@localhost:5434/petrace'),
  seedDemoData: process.env.SEED_DEMO_DATA === 'true',
  jwtSecret: required('JWT_SECRET', 'dev-only-secret-change-me'),
  // Puste = automatycznie: ciasteczko tylko przez HTTPS w produkcji.
  cookieSecure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : isProduction,
}

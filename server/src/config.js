import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const isProduction = process.env.NODE_ENV === 'production'

// W produkcji brak zmiennej zatrzymuje serwer, żeby nie działał np. ze znanym wszystkim sekretem.
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
  // Bez ustawienia ciasteczko wymaga HTTPS tylko w produkcji.
  cookieSecure: process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : isProduction,
}

import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const isProduction = process.env.NODE_ENV === 'production'


function required(name, fallbackForDev) {
  const value = process.env[name]
  if (value) return value
  // W trybie deweloperskim pozwalamy na wartość domyślną, żeby serwer dało się uruchomić
  // bez konfiguracji. W produkcji brak zmiennej to błąd — lepiej nie wystartować, niż
  // np. podpisywać sesje znanym wszystkim sekretem.
  if (!isProduction && fallbackForDev !== undefined) return fallbackForDev
  throw new Error(`Brak wymaganej zmiennej środowiskowej ${name}.`)
}

export const config = {
  isProduction,
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: required('DATABASE_URL', 'postgres://petrace:petrace@localhost:5434/petrace'),
  seedDemoData: process.env.SEED_DEMO_DATA === 'true',
}
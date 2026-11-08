import pg from 'pg'
import { config } from './config.js'

// Pula połączeń: zapytania pożyczają wolne połączenie zamiast otwierać nowe za każdym razem.
export const pool = new pg.Pool({ connectionString: config.databaseUrl })

// DATE zostaje napisem 'RRRR-MM-DD'. Domyślnie pg robi z niego Date o północy czasu lokalnego,
// co po zamianie na JSON (UTC) potrafi przesunąć datę o dzień.
pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value)
// NUMERIC pg zwraca jako napis (żeby nie tracić precyzji). Nam wystarczy zwykła liczba, np. waga.
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => Number(value))

// Wartości zawsze jako parametry ($1, $2…), nigdy sklejane w napis SQL: to chroni przed SQL injection.
export function query(text, params) {
  return pool.query(text, params)
}

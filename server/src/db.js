import pg from 'pg'
import { config } from './config.js'

export const pool = new pg.Pool({ connectionString: config.databaseUrl })

// Data zostaje napisem, bo zamiana na Date potrafi przesunąć ją o dzień.
pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value)
// Liczby z kolumn NUMERIC pg domyślnie zwraca jako napisy.
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => Number(value))

export function query(text, params) {
  return pool.query(text, params)
}

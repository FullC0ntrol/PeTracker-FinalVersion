import { readFile } from 'node:fs/promises'
import { query } from './db.js'

const SQL_DIR = new URL('../sql/', import.meta.url)

async function runSqlFile(name) {
  const sql = await readFile(new URL(name, SQL_DIR), 'utf8')
  await query(sql)
}

// Dane demo trafiają tylko do pustej bazy, więc restart serwera niczego nie dubluje.
export async function seedDemoDataIfEmpty() {
  const { rows } = await query('SELECT count(*)::int AS count FROM users')
  if (rows[0].count > 0) return
  await runSqlFile('seed.sql')
  console.log('Wczytano dane przykładowe. Konto demo: maciej@pettrace.pl, PIN 123456')
}

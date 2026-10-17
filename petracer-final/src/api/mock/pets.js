import { getDb } from '../../mocks/db'
import { delay, toPet } from './client'

export async function getPets() {
  await delay()
  const db = getDb()
  return db.pets.map((pet) => toPet(db, pet))
}

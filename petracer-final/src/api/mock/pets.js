import { getDb } from '../../mocks/db'
import { delay } from './client'

export async function getPets() {
  await delay()
  return getDb().pets
}

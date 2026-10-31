import { getDb } from '../../mocks/db'
import { delay, toPet } from './client'

// TODO: po dodaniu sesji filtrować po właścicielu: db.pets.filter((pet) => pet.ownerId === currentUserId)
export async function getPets() {
  await delay()
  const db = getDb()
  return db.pets.map((pet) => toPet(db, pet))
}

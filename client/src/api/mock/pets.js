import { getDb } from '../../mocks/db'
import { apiError } from '../errors'
import { delay, toPet } from './client'

// TODO: po dodaniu sesji filtrować po właścicielu: db.pets.filter((pet) => pet.ownerId === currentUserId)
export async function getPets() {
  await delay()
  const db = getDb()
  return db.pets.map((pet) => toPet(db, pet))
}

export async function getPetById(id) {
  await delay()
  const db = getDb()
  const pet = db.pets.find((item) => item.id === id)
  if (!pet) throw apiError(404, 'Nie znaleziono zwierzęcia.')
  return toPet(db, pet)
}
/*
  Narzędzia wspólne dla implementacji mock.

  Każda funkcja w api/mock/ działa jak „serwer”: czeka chwilę (udajemy sieć), czyta bazę z `mocks/`,
  sprawdza uprawnienia i zwraca dane albo rzuca błąd — dokładnie tak jak trasy w server/src/routes/.
  Zwraca też te same pola co prawdziwe API, więc strony działają z oboma trybami bez zmian.
*/

// Sztuczne opóźnienie 200–500 ms, żeby stany ładowania (spinner) było widać.
export function delay(minMs = 200, maxMs = 500) {
  const ms = minMs + Math.random() * (maxMs - minMs)
  return new Promise((resolve) => setTimeout(resolve, ms))
}


export function toPet(db, pet) {
  const tag = db.tags.find((item) => item.petId === pet.id && item.isActive)
   return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    birthDate: pet.birthDate,
    weightKg: pet.weightKg,
    medicalNotes: pet.medicalNotes,
    isLost: pet.isLost,
    lostMessage: pet.lostMessage,
    tagCode: tag?.code ?? null,
    createdAt: pet.createdAt,
  }
}
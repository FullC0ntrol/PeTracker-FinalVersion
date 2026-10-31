// Zapamiętuje ostatnie zwierzę do panelu

const KEY = 'pettrace:lastPet'

export function getLastPetId() {
  try{
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setLastPetId(petId) {
  try {
    localStorage.setItem(KEY, petId)
  } catch {
    //Bez zapamiętania, panel otworzy pierwsze zwierze
  }
}
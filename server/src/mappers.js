// Pola są wybrane ręcznie, żeby pin_hash nigdy nie trafił do odpowiedzi.
export function toUser(row) {
  return { id: row.id, email: row.email, name: row.name, phone: row.phone }
}

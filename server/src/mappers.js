// Wiersz z bazy (snake_case) → obiekt JSON dla frontendu (camelCase).
// Mapper wybiera pola jawnie, więc np. pin_hash nigdy nie wyjdzie poza serwer.

export function toUser(row) {
  return { id: row.id, email: row.email, name: row.name, phone: row.phone }
}

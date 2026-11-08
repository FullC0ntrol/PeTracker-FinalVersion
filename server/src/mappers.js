/*
  Zamiana wierszy z bazy (snake_case, jak w SQL) na obiekty JSON dla frontendu (camelCase, jak w JS).
  Jedno miejsce, w którym ustalamy, jak wygląda np. „zwierzę” w API. Mapper sam wybiera pola,
  dlatego np. `pin_hash` nigdy nie wyjdzie poza serwer.
*/

export function toUser(row) {
  return { id: row.id, email: row.email, name: row.name, phone: row.phone }
}
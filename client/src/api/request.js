/*
  Jedno miejsce, które wykonuje zapytania do serwera. Pozostałe pliki w api/ podają tylko
  metodę, adres i dane.

  - Adres zaczyna się od /api: frontend i API są pod tą samą domeną (w produkcji rozdziela je Caddy,
    w `npm run dev` — proxy Vite), więc nie trzeba konfigurować CORS.
  - Ciasteczko sesji (httpOnly) przeglądarka dołącza sama; JavaScript go nie widzi i nie musi.
  - Odpowiedź z błędem (4xx, 5xx) zamieniamy na wyjątek z komunikatem od serwera.
*/
function apiError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
}

export async function request(method, path, body) {
  let response 
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: 'same-origin', // żeby przeglądarka dołączała ciasteczko sesji
    }
    )
  } catch {
    throw apiError(0, 'Nie można połączyć się z serwerem. Sprawdź połączenie internetowe.')
  }

  if (response.status === 204) return null

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw apiError(response.status, data?.message ?? 'Nieznany błąd serwera.')
  }
  return data
}
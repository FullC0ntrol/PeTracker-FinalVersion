import { HttpError } from '../errors.js'

// Express rozpoznaje obsługę błędów po tym, że funkcja ma 4 parametry.
// Express 5 sam łapie błędy z funkcji async, więc trasy mogą po prostu rzucać HttpError.
export function errorHandler(error, req, res, _next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message })
  }
  // Te dwa błędy pochodzą z express.json().
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Niepoprawny format danych.' })
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Za dużo danych w jednym żądaniu.' })
  }
  // Szczegóły błędu trafiają tylko do logów, a nie do użytkownika.
  console.error(error)
  res.status(500).json({
    error: 'Coś poszło nie tak po stronie serwera. Spróbuj ponownie za chwilę.',
  })
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Nie ma takiego adresu API.' })
}

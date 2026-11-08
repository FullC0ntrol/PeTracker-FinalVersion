import { HttpError } from "../errors.js";

export function errorHandler(error, req, res, next) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Niepoprawny format danych." });
  }
  console.error(error);
  res
    .status(500)
    .json({
      error:
        "Coś poszło nie tak po stronie serwera. Spróbuj ponownie za chwilę.",
    });
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Nie ma takiego adresu API.' })
}
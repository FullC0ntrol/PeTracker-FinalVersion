// Błąd z komunikatem dla użytkownika, errorHandler odsyła go z podanym kodem HTTP.
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// Błąd „przewidziany”: rzucony gdziekolwiek, errorHandler zamieni go na odpowiedź
// { error: message } z podanym kodem HTTP. Wiadomość widzi użytkownik, więc piszemy ją po ludzku.
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

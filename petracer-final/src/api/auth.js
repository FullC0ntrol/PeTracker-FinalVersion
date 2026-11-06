// Fasada logowania — patrz komentarz w api/pets.js.
/*
  Logowanie bez hasła ( magic link ) i dane konta.
    requestMagicLink(email, { name, next }) => { email, devLink? }  POST /api/auth/request-link
    verifyToken(token)  => { user }   POST /api/auth/verify
    getCurrentUser() => user | null GET /api/auth/me
    logout()      POST /api/auth/logout
    updateSettings({ name, phone })  => user  PATCH /api/me
    getDemoLogin()   => { enabled, email }   GET /api/auth/demo
    loginAsDemo()  =>  { user }   POST /api/auth/demo
*/

export { requestMagicLink } from './mock/auth.js'

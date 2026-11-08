import cookieParser from 'cookie-parser'
import express from 'express'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.js'

// Aplikacja jest osobno od index.js, żeby testy mogły ją tworzyć bez uruchamiania serwera.
export function createApp() {
  const app = express()

  app.use(express.json({ limit: '20kb' }))
  app.use(cookieParser())

  app.get('/api/health', (req, res) => {
    res.json({ ok: true })
  })
  app.use('/api/auth', authRouter)

  // 404 i obsługa błędów muszą być na samym końcu.
  app.use('/api', notFound)
  app.use(errorHandler)

  return app
}

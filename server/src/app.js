// Składa aplikację Express. Osobno od index.js, żeby testy mogły ją tworzyć bez startu serwera.
import cookieParser from 'cookie-parser'
import express from 'express'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { authRouter } from './routes/auth.js'

export function createApp() {
  const app = express()

  // Kolejność ma znaczenie: każde żądanie przechodzi przez app.use() od góry do dołu.
  app.use(express.json({ limit: '20kb' }))
  app.use(cookieParser())

  app.get('/api/health', (req, res) => {
    res.json({ ok: true })
  })
  app.use('/api/auth', authRouter)

  app.use('/api', notFound)
  app.use(errorHandler)

  return app
}

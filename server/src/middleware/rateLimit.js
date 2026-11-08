import { HttpError } from '../errors.js'

export function rateLimit({ windowMs, max, keyFn, message }) {
  const hits = new Map()
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of hits) if (entry.resetAt <= now) hits.delete(key)
  }, windowMs).unref()

    return function rateLimitMiddleware(req, res, next) {
    const key = keyFn(req)
    const now = Date.now()
    const entry = hits.get(key)

    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs })
      return next()
    }

    entry.count += 1
    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)))
      throw new HttpError(429, message)
    }
    next()
  }
}
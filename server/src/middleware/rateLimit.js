import { HttpError } from '../errors.js'

export function rateLimit({ windowMs, max, keyFn, message }) {
  const hits = new Map()
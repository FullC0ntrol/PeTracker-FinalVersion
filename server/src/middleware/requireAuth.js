import { query } from '../db.js'
import { readSessionUserId } from '../services/session.js'

export async function loadUser(req, res, next) {
  const userId = readSessionUserId(req)
  req.user = null
  if (userId) {
    const { rows } = await query('SELECT id, email, name, phone FROM users WHERE id = $1', [userId])
    req.user = rows[0] ?? null
  }
  next()
}
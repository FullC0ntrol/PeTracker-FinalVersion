import { Router } from "express";
import { query } from "../db.js";
import { HttpError } from "../errors.js";
import { toUser } from "../mappers.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { hashPin, verifyPin } from "../services/pin.js";
import { parseEmail, parseName, parsePin } from "../validation.js";

export const authRouter = Router();

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const limitRegisterByIp = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 10,
  keyFn: (req) => req.ip,
  message:
    "Za dużo prób założenia konta. Spróbuj ponownie za kilkanaście minut.",
});

authRouter.post("/register", limitRegisterByIp, async (req, res) => {
  const email = parseEmail(req.body.email);
  const name = parseName(req.body.name);
  const pin = parsePin(req.body.pin);

  // ON CONFLICT: dwie równoczesne rejestracje tego samego adresu nie skończą się błędem bazy.
  const { rows } = await query(
    `INSERT INTO users (email, name, pin_hash) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, email, name, phone`,
    [email, name, await hashPin(pin)],
  );
  if (!rows[0])
    throw new HttpError(
      409,
      "Konto z tym adresem e-mail już istnieje. Zaloguj się.",
    );
  res.status(201).json({ user: toUser(rows[0]) });
});

authRouter.post("/login", async (req, res) => {
  const email = parseEmail(req.body.email);
  const pin = parsePin(req.body.pin);

  const { rows } = await query(
    "SELECT id, email, name, phone, pin_hash FROM users WHERE email = $1",
    [email],
  );
  if (!rows[0] || !(await verifyPin(pin, rows[0].pin_hash))) {
    throw new HttpError(401, "Nieprawidłowy e-mail lub PIN.");
  }
  res.json({ user: toUser(rows[0]) });
});

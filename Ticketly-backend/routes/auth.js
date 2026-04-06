import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { db, generateId } from '../db.js'

const router = Router()

const MIN_PASSWORD_LENGTH = 6
const signupRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many signup attempts. Please try again later.' },
})

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' },
})

function normalizeEmail(email = '') {
  return email.trim().toLowerCase()
}

function isValidEmail(email = '') {
  const normalized = normalizeEmail(email)
  const atIndex = normalized.indexOf('@')
  const lastAtIndex = normalized.lastIndexOf('@')
  const dotIndex = normalized.lastIndexOf('.')

  if (!normalized || normalized.length > 254) return false
  if (atIndex <= 0 || atIndex !== lastAtIndex) return false
  if (dotIndex < atIndex + 2 || dotIndex >= normalized.length - 1) return false
  if (normalized.includes(' ')) return false

  return true
}

router.post('/signup', signupRateLimiter, async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }

    const normalizedEmail = normalizeEmail(email)
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' })
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` })
    }

    if (typeof confirmPassword !== 'undefined' && password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and confirm password do not match.' })
    }

    const exists = db.users.some((u) => u.email === normalizedEmail)
    if (exists) {
      return res.status(409).json({ message: 'User already exists with this email.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = {
      id: `usr-${generateId()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    db.users.push(user)

    return res.status(201).json({
      message: 'User registered successfully',
      userId: user.id,
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error during signup.', error: err.message })
  }
})

router.post('/login', loginRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const normalizedEmail = normalizeEmail(email)
    const user = db.users.find((u) => u.email === normalizedEmail)

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash)
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    )

    return res.status(200).json({
      message: 'Login successful',
      token,
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error during login.', error: err.message })
  }
})

export default router

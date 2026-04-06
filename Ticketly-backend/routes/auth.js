import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db, generateId } from '../Backend/db.js'

const router = Router()

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

function normalizeEmail(email = '') {
  return email.trim().toLowerCase()
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }

    const normalizedEmail = normalizeEmail(email)
    if (!EMAIL_REGEX.test(normalizedEmail)) {
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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const normalizedEmail = normalizeEmail(email)
    const user = db.users.find((u) => u.email === normalizedEmail)

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
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

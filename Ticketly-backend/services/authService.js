import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { ApiError } from '../utils/apiError.js'
import { signAuthToken } from '../utils/jwt.js'

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email)
}

export async function registerUser({ name, email, password }) {
  if (!validateEmail(email)) {
    throw new ApiError(400, 'Valid email is required.')
  }
  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters.')
  }

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    throw new ApiError(409, 'User with this email already exists.')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
  })

  const token = signAuthToken({ userId: user._id.toString() })
  return { token, user: sanitizeUser(user) }
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase().trim() })
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.')
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.')
  }

  const token = signAuthToken({ userId: user._id.toString() })
  return { token, user: sanitizeUser(user) }
}

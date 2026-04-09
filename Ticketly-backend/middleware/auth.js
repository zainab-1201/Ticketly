import { verifyAuthToken } from '../utils/jwt.js'
import { ApiError } from '../utils/apiError.js'
import User from '../models/User.js'

export async function requireAuth(req, _res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return next(new ApiError(401, 'Missing authorization token.'))
  }

  try {
    const payload = verifyAuthToken(token)
    const user = await User.findById(payload.userId).select('-passwordHash')
    if (!user) {
      return next(new ApiError(401, 'Invalid authentication token.'))
    }
    req.user = user
    return next()
  } catch {
    return next(new ApiError(401, 'Invalid or expired token.'))
  }
}

import jwt from 'jsonwebtoken'

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || ''

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is required.' })
  }

  const token = authHeader.slice(7).trim()
  if (!token) {
    return res.status(401).json({ message: 'Authentication token is required.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (_error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' })
  }
}

import { ApiError } from '../utils/apiError.js'

export function notFoundHandler(_req, res) {
  res.status(404).json({ message: 'Route not found.' })
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.details,
    })
  }

  if (err?.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error.',
      details: Object.values(err.errors).map((e) => e.message),
    })
  }

  if (err?.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format.' })
  }

  console.error('Unhandled error:', err)
  return res.status(500).json({ message: 'Internal server error.' })
}

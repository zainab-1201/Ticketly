import { ApiError } from '../utils/apiError.js'

export function validateBody(validator) {
  return (req, _res, next) => {
    try {
      req.validatedBody = validator(req.body)
      next()
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err)
      }
      return next(new ApiError(400, err.message || 'Invalid request body.'))
    }
  }
}

export function requiredString(value, fieldName) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ApiError(400, `${fieldName} is required.`)
  }
  return value.trim()
}

export function requiredPositiveNumber(value, fieldName, min = 1) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < min) {
    throw new ApiError(400, `${fieldName} must be at least ${min}.`)
  }
  return parsed
}

export function optionalBoolean(value) {
  if (value === undefined) return undefined
  return Boolean(value)
}

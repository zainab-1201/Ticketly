import { ApiError } from '../utils/apiError.js'
import { optionalBoolean, requiredPositiveNumber, requiredString } from '../middleware/validate.js'

export function createEventSchema(body) {
  return {
    name: requiredString(body.name, 'name'),
    category: body.category?.trim() || 'Music',
    date: requiredString(body.date, 'date'),
    time: body.time?.trim() || '19:00',
    venue: requiredString(body.venue, 'venue'),
    city: body.city?.trim() || 'Lahore',
    totalSeats: requiredPositiveNumber(body.totalSeats, 'totalSeats', 1),
    price: requiredPositiveNumber(body.price, 'price', 0),
    description: body.description?.trim() || '',
    image: body.image?.trim() || '',
    tags: Array.isArray(body.tags) ? body.tags.map((t) => String(t).trim()).filter(Boolean) : [],
    featured: optionalBoolean(body.featured) || false,
  }
}

export function updateEventSchema(body) {
  const payload = {}

  if (body.name !== undefined) payload.name = requiredString(body.name, 'name')
  if (body.category !== undefined) payload.category = String(body.category).trim()
  if (body.date !== undefined) payload.date = requiredString(body.date, 'date')
  if (body.time !== undefined) payload.time = String(body.time).trim()
  if (body.venue !== undefined) payload.venue = requiredString(body.venue, 'venue')
  if (body.city !== undefined) payload.city = String(body.city).trim()
  if (body.totalSeats !== undefined) payload.totalSeats = requiredPositiveNumber(body.totalSeats, 'totalSeats', 1)
  if (body.price !== undefined) payload.price = requiredPositiveNumber(body.price, 'price', 0)
  if (body.description !== undefined) payload.description = String(body.description)
  if (body.image !== undefined) payload.image = String(body.image)
  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags)) throw new ApiError(400, 'tags must be an array.')
    payload.tags = body.tags.map((t) => String(t).trim()).filter(Boolean)
  }
  if (body.featured !== undefined) payload.featured = Boolean(body.featured)

  return payload
}

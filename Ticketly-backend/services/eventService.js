import Event from '../models/Event.js'
import { ApiError } from '../utils/apiError.js'
import { escapeRegex } from '../utils/sanitize.js'

function formatEvent(eventDoc) {
  const e = eventDoc.toObject()
  return { ...e, id: e._id.toString() }
}

export async function listEvents({ category, search, featured }) {
  const query = {}
  const safeCategory = typeof category === 'string' ? category : undefined
  const safeFeatured = typeof featured === 'string' ? featured : undefined
  const safeSearch = typeof search === 'string' ? search : undefined

  if (safeCategory && safeCategory !== 'All') {
    query.category = safeCategory
  }

  if (safeFeatured === 'true') {
    query.featured = true
  }

  if (safeSearch) {
    const q = escapeRegex(safeSearch.trim())
    query.$or = [
      { name: new RegExp(q, 'i') },
      { venue: new RegExp(q, 'i') },
      { city: new RegExp(q, 'i') },
    ]
  }

  const events = await Event.find(query).sort({ createdAt: -1 })
  return events.map(formatEvent)
}

export async function getEventById(id) {
  const event = await Event.findById(id)
  if (!event) throw new ApiError(404, 'Event not found.')
  return formatEvent(event)
}

export async function createEvent(payload) {
  const event = await Event.create(payload)
  return formatEvent(event)
}

export async function updateEvent(id, payload) {
  const existing = await Event.findById(id)
  if (!existing) throw new ApiError(404, 'Event not found.')

  const nextTotalSeats = payload.totalSeats !== undefined ? Number(payload.totalSeats) : existing.totalSeats
  if (nextTotalSeats < existing.bookedSeats + existing.reservedSeats) {
    throw new ApiError(400, `Cannot reduce totalSeats below already booked+reserved (${existing.bookedSeats + existing.reservedSeats}).`)
  }

  const updated = await Event.findByIdAndUpdate(
    id,
    {
      ...payload,
      totalSeats: nextTotalSeats,
      bookedSeats: existing.bookedSeats,
      reservedSeats: existing.reservedSeats,
    },
    { new: true, runValidators: true }
  )

  return formatEvent(updated)
}

export async function deleteEvent(id) {
  const event = await Event.findByIdAndDelete(id)
  if (!event) throw new ApiError(404, 'Event not found.')
}

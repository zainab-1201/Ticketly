import Event from '../models/Event.js'
import Reservation from '../models/Reservation.js'
import { ApiError } from '../utils/apiError.js'
import { env } from '../config/env.js'
import { generateReservationRef } from '../utils/ids.js'

function formatReservation(doc) {
  const r = doc.toObject()
  return { ...r, id: r._id.toString() }
}

export async function createReservation({ eventId, seats, holderName, holderEmail }) {
  const now = new Date()
  const expiresAt = new Date(now.getTime() + env.reservationHoldMinutes * 60 * 1000)

  const event = await Event.findOneAndUpdate(
    {
      _id: eventId,
      $expr: {
        $gte: [
          { $subtract: ['$totalSeats', { $add: ['$bookedSeats', '$reservedSeats'] }] },
          Number(seats),
        ],
      },
    },
    { $inc: { reservedSeats: Number(seats) } },
    { new: true }
  )

  if (!event) {
    throw new ApiError(400, 'Not enough seats available or event not found.')
  }

  const reservation = await Reservation.create({
    reservationRef: generateReservationRef(),
    eventId: event._id,
    seats: Number(seats),
    status: 'Active',
    holderName: holderName?.trim() || 'Guest',
    holderEmail: holderEmail?.trim() || '',
    expiresAt,
  })

  return formatReservation(reservation)
}

export async function cancelReservation(id) {
  const reservation = await Reservation.findById(id)
  if (!reservation) throw new ApiError(404, 'Reservation not found.')

  if (reservation.status !== 'Active') {
    throw new ApiError(400, 'Only active reservations can be cancelled.')
  }

  await Event.findOneAndUpdate(
    { _id: reservation.eventId, reservedSeats: { $gte: reservation.seats } },
    { $inc: { reservedSeats: -reservation.seats } }
  )

  reservation.status = 'Cancelled'
  await reservation.save()

  return formatReservation(reservation)
}

export async function listReservations({ eventId }) {
  const query = eventId ? { eventId } : {}
  const reservations = await Reservation.find(query).sort({ createdAt: -1 })
  return reservations.map(formatReservation)
}

export async function expireReservations() {
  const now = new Date()
  const activeExpired = await Reservation.find({
    status: 'Active',
    expiresAt: { $lte: now },
  })

  if (activeExpired.length === 0) {
    return { expiredCount: 0 }
  }

  const perEventSeats = new Map()
  for (const reservation of activeExpired) {
    const key = reservation.eventId.toString()
    perEventSeats.set(key, (perEventSeats.get(key) || 0) + reservation.seats)
  }

  const eventOps = Array.from(perEventSeats.entries()).map(([eventId, seats]) => ({
    updateOne: {
      filter: { _id: eventId },
      update: { $inc: { reservedSeats: -seats } },
    },
  }))

  if (eventOps.length > 0) {
    await Event.bulkWrite(eventOps)
  }

  await Reservation.updateMany(
    { _id: { $in: activeExpired.map((r) => r._id) } },
    { $set: { status: 'Expired' } }
  )

  return { expiredCount: activeExpired.length }
}

import Event from '../models/Event.js'
import Booking from '../models/Booking.js'
import Reservation from '../models/Reservation.js'
import { ApiError } from '../utils/apiError.js'
import { generateBookingRef } from '../utils/ids.js'
import { createTicketFromPayload } from './ticketService.js'
import mongoose from 'mongoose'

function formatBooking(doc) {
  const b = doc.toObject()
  return { ...b, id: b._id.toString() }
}

export async function createBooking({ eventId, seats, holderName, holderEmail, reservationId }) {
  const now = new Date()
  const normalizedSeats = Number(seats)
  let finalEventId = eventId
  let finalSeats = normalizedSeats
  let finalReservationId = null

  if (reservationId) {
    const reservation = await Reservation.findById(reservationId)
    if (!reservation) throw new ApiError(404, 'Reservation not found.')
    if (reservation.status !== 'Active') throw new ApiError(400, 'Reservation is not active.')
    if (reservation.expiresAt <= now) throw new ApiError(400, 'Reservation has expired.')

    finalEventId = reservation.eventId
    finalSeats = reservation.seats
    finalReservationId = reservation._id

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: reservation.eventId, reservedSeats: { $gte: reservation.seats } },
      { $inc: { reservedSeats: -reservation.seats, bookedSeats: reservation.seats } },
      { new: true }
    )

    if (!updatedEvent) {
      throw new ApiError(409, 'Unable to confirm reservation seats.')
    }

    reservation.status = 'Confirmed'
    await reservation.save()
  } else {
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: finalEventId,
        $expr: {
          $gte: [
            { $subtract: ['$totalSeats', { $add: ['$bookedSeats', '$reservedSeats'] }] },
            finalSeats,
          ],
        },
      },
      { $inc: { bookedSeats: finalSeats } },
      { new: true }
    )

    if (!updatedEvent) {
      throw new ApiError(400, 'Not enough seats available or event not found.')
    }
  }

  const booking = await Booking.create({
    bookingRef: generateBookingRef(),
    eventId: finalEventId,
    reservationId: finalReservationId,
    seats: finalSeats,
    status: 'Booked',
    holderName: holderName?.trim() || 'Guest',
    holderEmail: holderEmail?.trim() || '',
  })

  const ticket = await createTicketFromPayload({ bookingId: booking._id.toString() })

  return {
    booking: formatBooking(booking),
    ticket,
  }
}

export async function listBookings({ eventId }) {
  const query = {}
  if (eventId !== undefined) {
    if (typeof eventId !== 'string' || !mongoose.isValidObjectId(eventId)) {
      throw new ApiError(400, 'Invalid eventId filter.')
    }
    query.eventId = eventId
  }
  const bookings = await Booking.find(query).sort({ createdAt: -1 })
  return bookings.map(formatBooking)
}

export async function getBookingById(id) {
  const booking = await Booking.findById(id)
  if (!booking) throw new ApiError(404, 'Booking not found.')
  return formatBooking(booking)
}
